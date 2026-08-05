/**
 * Подготовка предметных фото для сайта.
 *
 * Общая идея: изделие на снимке обесцвечивается до нейтрального серого
 * с сохранением светотени, рядом сохраняется маска его области. На сайте
 * поверх маски накладывается выбранный цвет режимом multiply — текстура
 * кожи, строчка и блики остаются на месте, а цвет меняется.
 *
 * Фон у всех кадров один — тёплая замша, снятая с фотографии красного
 * ошейника. Кадры со студийным голубым фоном вырезаются и переносятся
 * на неё, кадр на замше остаётся как есть.
 *
 * Запуск:
 *   node scripts/process-photos.mjs <папка-назначения> <папка-исходников>
 */
import sharp from "sharp";
import path from "node:path";
import { unlink } from "node:fs/promises";

const OUT = process.argv[2];
const SRC = process.argv[3];

const SIZE = 1400; // сторона итогового квадрата
const PAD = 0.06; // поля вокруг предмета при кадрировании

/** Мягкая ступенька: 0 ниже a, 1 выше b. */
const ramp = (v, a, b) => Math.min(1, Math.max(0, (v - a) / (b - a)));

/** Оттенок в градусах, насыщенность в долях, яркость 0..255 — модель HSV. */
function hsv(r, g, b) {
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  const d = mx - mn;
  if (!d) return { h: 0, s: 0, v: mx };
  let h;
  if (mx === r) h = 60 * (((g - b) / d) % 6);
  else if (mx === g) h = 60 * ((b - r) / d + 2);
  else h = 60 * ((r - g) / d + 4);
  if (h < 0) h += 360;
  return { h, s: d / mx, v: mx };
}

/** Попадание оттенка в диапазон, в том числе с переходом через 0°. */
const inHue = (h, from, to) =>
  from <= to ? h >= from && h <= to : h >= from || h <= to;

/**
 * Разметка связных областей (4-связность) и выбор самой крупной.
 * Отсекает крапинки, которые остаются от неровного фона.
 */
function largestComponent(map, width, height, threshold) {
  const labels = new Int32Array(width * height).fill(-1);
  const stack = new Int32Array(width * height);
  let best = -1;
  let bestSize = 0;
  let label = 0;

  for (let start = 0; start < map.length; start++) {
    if (map[start] <= threshold || labels[start] !== -1) continue;

    let top = 0;
    stack[top++] = start;
    labels[start] = label;
    let size = 0;

    const push = (next) => {
      if (map[next] > threshold && labels[next] === -1) {
        labels[next] = label;
        stack[top++] = next;
      }
    };

    while (top > 0) {
      const idx = stack[--top];
      size++;
      const x = idx % width;
      const y = (idx / width) | 0;
      if (x > 0) push(idx - 1);
      if (x < width - 1) push(idx + 1);
      if (y > 0) push(idx - width);
      if (y < height - 1) push(idx + width);
    }

    if (size > bestSize) {
      bestSize = size;
      best = label;
    }
    label++;
  }

  const keep = new Uint8Array(width * height);
  for (let i = 0; i < keep.length; i++) keep[i] = labels[i] === best ? 1 : 0;
  return keep;
}

/**
 * Квадратная рамка вокруг предмета.
 * clamp — не выходить за края снимка: нужно там, где фон настоящий
 * и дорисовывать его нечем.
 */
function squareFrame(box, width, height, { clamp = false } = {}) {
  const w = box.maxX - box.minX + 1;
  const h = box.maxY - box.minY + 1;
  let side = Math.round(Math.max(w, h) * (1 + PAD * 2));
  if (clamp) side = Math.min(side, width, height);

  let left = Math.round(box.minX - (side - w) / 2);
  let top = Math.round(box.minY - (side - h) / 2);
  if (clamp) {
    left = Math.min(Math.max(0, left), width - side);
    top = Math.min(Math.max(0, top), height - side);
  }
  return { left, top, side };
}

/** Кадрирование сырого буфера в квадрат SIZE×SIZE. */
async function writeSquare(buffer, width, height, frame, file, background) {
  const padded = await sharp(buffer, { raw: { width, height, channels: 4 } })
    .extend({
      top: Math.max(0, -frame.top),
      left: Math.max(0, -frame.left),
      bottom: Math.max(0, frame.top + frame.side - height),
      right: Math.max(0, frame.left + frame.side - width),
      background: background ?? { r: 0, g: 0, b: 0, alpha: 0 },
    })
    // sharp применяет extend после resize, поэтому кадрируем в два прохода
    .png()
    .toBuffer();

  return sharp(padded)
    .extract({
      left: Math.max(0, frame.left),
      top: Math.max(0, frame.top),
      width: frame.side,
      height: frame.side,
    })
    .resize(SIZE, SIZE)
    .png({ compressionLevel: 9 })
    .toFile(file);
}

async function readRaw(file) {
  const { data, info } = await sharp(path.join(SRC, file))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return {
    data,
    width: info.width,
    height: info.height,
    channels: info.channels,
  };
}

/** Рамка по булевой карте предмета. */
function boundingBox(keep, width) {
  let minX = Infinity, minY = Infinity, maxX = 0, maxY = 0;
  for (let idx = 0; idx < keep.length; idx++) {
    if (!keep[idx]) continue;
    const x = idx % width;
    const y = (idx / width) | 0;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  return { minX, minY, maxX, maxY };
}

/**
 * Фон-подложка: реальный кусок замши с фотографии красного ошейника,
 * растянутый и размытый. Так у всех карточек одинаковый тёплый фон.
 */
async function makeBackdrop(file, region, brightness) {
  // Кусок берём заведомо в стороне от изделия, иначе его цвет
  // размажется по всей подложке.
  const patch = await sharp(path.join(SRC, file))
    .extract(region)
    .png()
    .toBuffer();

  return sharp(patch)
    .resize(SIZE, SIZE, { fit: "fill" })
    .blur(45)
    .modulate({ brightness })
    .png()
    .toBuffer();
}

/**
 * Кадр на студийном голубом фоне: вырезаем предмет, обесцвечиваем область
 * подклада и переносим на замшевую подложку.
 */
async function processOnBlue(name, file, backdrop) {
  const { data, width, height, channels } = await readRaw(file);
  const base = Buffer.alloc(width * height * 4);
  const mask = Buffer.alloc(width * height * 4);
  const alphaMap = new Uint8Array(width * height);

  for (let i = 0, p = 0; i < data.length; i += channels, p += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    // Фон: синий канал выше зелёного и пиксель светлый.
    const alpha = Math.round((1 - ramp(b - g, 0, 6) * ramp(lum, 95, 115)) * 255);

    // Подклад: зелёный выше синего и выше красного.
    const tint = ramp(g - b, 8, 18) * ramp(g - r, 2, 10) * ramp(lum, 32, 52);

    const grey = Math.min(255, Math.round((Math.max(r, g, b) / 225) * 255));
    base[p] = Math.round(r * (1 - tint) + grey * tint);
    base[p + 1] = Math.round(g * (1 - tint) + grey * tint);
    base[p + 2] = Math.round(b * (1 - tint) + grey * tint);
    base[p + 3] = alpha;

    mask[p] = mask[p + 1] = mask[p + 2] = 255;
    mask[p + 3] = Math.round(tint * alpha);
    alphaMap[p / 4] = alpha;
  }

  const keep = largestComponent(alphaMap, width, height, 128);
  for (let idx = 0, p = 0; idx < keep.length; idx++, p += 4) {
    if (!keep[idx]) {
      base[p + 3] = 0;
      mask[p + 3] = 0;
    }
  }

  const frame = squareFrame(boundingBox(keep, width), width, height);
  const cutout = path.join(OUT, `${name}-cutout.png`);
  await writeSquare(base, width, height, frame, cutout);
  await writeSquare(mask, width, height, frame, path.join(OUT, `${name}-tint.png`));

  await sharp(backdrop)
    .composite([{ input: cutout }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT, `${name}.png`));

  await unlink(cutout); // промежуточный файл в сборке не нужен

  console.log(`${name}: вырезан с голубого фона и перенесён на замшу`);
}

/**
 * Кадр на сером бетоне: фон почти не окрашен, изделия — наоборот.
 * Вырезаем по насыщенности и переносим на замшу. Перекраска не нужна:
 * это витринный кадр, где цвета показаны как есть.
 */
async function processOnGrey(name, file, backdrop, minSat) {
  const { data, width, height, channels } = await readRaw(file);
  const base = Buffer.alloc(width * height * 4);
  const alphaMap = new Uint8Array(width * height);

  for (let i = 0, p = 0; i < data.length; i += channels, p += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const { s, v } = hsv(r, g, b);

    // Изделие — насыщенный цвет либо заметно тёмная зона (тени внутри).
    const alpha = Math.round(255 * Math.max(ramp(s, minSat - 0.1, minSat), 0));

    base[p] = r;
    base[p + 1] = g;
    base[p + 2] = b;
    base[p + 3] = v < 12 ? 255 : alpha;
    alphaMap[p / 4] = base[p + 3];
  }

  const keep = largestComponent(alphaMap, width, height, 128);
  for (let idx = 0, p = 0; idx < keep.length; idx++, p += 4) {
    if (!keep[idx]) base[p + 3] = 0;
  }

  const frame = squareFrame(boundingBox(keep, width), width, height);
  const cutout = path.join(OUT, `${name}-cutout.png`);
  await writeSquare(base, width, height, frame, cutout);

  await sharp(backdrop)
    .composite([{ input: cutout }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT, `${name}.png`));

  await unlink(cutout);
  console.log(`${name}: вырезан с серого фона и перенесён на замшу`);
}

/**
 * Кадр, снятый на замше: фон оставляем как есть, обесцвечиваем только кожу
 * заданного оттенка. Фурнитура, строчка и фон не трогаются.
 */
async function processOnSuede(name, file, { from, to, minSat, norm }) {
  const { data, width, height, channels } = await readRaw(file);
  const base = Buffer.alloc(width * height * 4);
  const mask = Buffer.alloc(width * height * 4);
  const hit = new Uint8Array(width * height);

  for (let i = 0, p = 0; i < data.length; i += channels, p += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const { h, s, v } = hsv(r, g, b);

    // Кожа и тень на замше близки по яркости, но не по оттенку:
    // у красной кожи он около 355–5°, у коричневой тени — 14–32°.
    // Поэтому режем именно по оттенку, а яркость только отсекает черноту.
    const tint = inHue(h, from, to)
      ? ramp(s, minSat - 0.12, minSat) * ramp(v, 28, 52)
      : 0;

    const grey = Math.min(255, Math.round((v / norm) * 255));
    base[p] = Math.round(r * (1 - tint) + grey * tint);
    base[p + 1] = Math.round(g * (1 - tint) + grey * tint);
    base[p + 2] = Math.round(b * (1 - tint) + grey * tint);
    base[p + 3] = 255;

    mask[p] = mask[p + 1] = mask[p + 2] = 255;
    mask[p + 3] = Math.round(tint * 255);
    hit[p / 4] = tint > 0.5 ? 255 : 0;
  }

  // Кадрируем по коже — она задаёт границы изделия.
  const keep = largestComponent(hit, width, height, 128);
  const frame = squareFrame(boundingBox(keep, width), width, height, {
    clamp: true,
  });

  await writeSquare(base, width, height, frame, path.join(OUT, `${name}.png`));
  await writeSquare(mask, width, height, frame, path.join(OUT, `${name}-tint.png`));

  console.log(`${name}: фон-замша сохранён, кожа обесцвечена под перекраску`);
}

// ── Что обрабатываем ────────────────────────────────────────────────
// Подложка берётся из ровно освещённой части кадра с красным ошейником.
const backdrop = await makeBackdrop(
  "s4.png",
  { left: 470, top: 430, width: 196, height: 144 },
  1.35,
);

// Ошейник с цветным подкладом — студийные кадры на голубом фоне.
await processOnBlue("collar-lined-front", "b.png", backdrop);
await processOnBlue("collar-lined-side", "a.png", backdrop);

// Однотонный ошейник — кадр уже на замше, красная кожа под перекраску.
await processOnSuede("collar-solid-main", "s4.png", {
  from: 338,
  to: 12,
  minSat: 0.45,
  norm: 235,
});

// Витринный кадр с четырьмя цветами — снят на сером бетоне.
await processOnGrey("collar-solid-colors", "s1.png", backdrop, 0.3);
