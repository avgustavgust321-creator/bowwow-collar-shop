/**
 * Опись фотографий товаров.
 *
 * Обходит public/images/tovary/<вид>/<модель>/ и записывает, какие файлы
 * лежат в каждой папке, в src/content/photo-manifest.json. Сайт читает эту
 * опись и сам раскладывает фото по товарам — вписывать пути вручную
 * больше не нужно: положили файл в папку модели, собрали сайт, фото на месте.
 *
 * Как файлы распределяются по товару, решает src/lib/photos.ts:
 * названные по цвету идут к этому цвету, остальные — в общую галерею
 * в порядке имён (1-…, 2-…).
 *
 * Запускается сам перед сборкой (npm run build → prebuild) и при старте
 * dev-сервера. Вручную: node scripts/photo-manifest.mjs
 */
import { readdirSync, statSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const base = path.join(root, "public/images/tovary");
const out = path.join(root, "src/content/photo-manifest.json");

const SHOWN = /\.(jpe?g|png|webp|avif)$/i;
// Форматы с телефона, которые браузеры не показывают — предупреждаем
const UNSUPPORTED = /\.(heic|heif|dng|raw|tiff?)$/i;

const collator = new Intl.Collator("ru", { numeric: true, sensitivity: "base" });

const manifest = {};
const warnings = [];

for (const kind of readdirSync(base).sort(collator.compare)) {
  const kindDir = path.join(base, kind);
  if (!statSync(kindDir).isDirectory()) continue;

  for (const model of readdirSync(kindDir).sort(collator.compare)) {
    const dir = path.join(kindDir, model);
    if (!statSync(dir).isDirectory()) continue;

    // macOS может отдать имя в разложенной форме Юникода (й = и + ˘),
    // а на сервере сборки оно будет в собранной. Приводим к одной.
    const files = readdirSync(dir)
      .map((f) => f.normalize("NFC"))
      .filter((f) => !f.startsWith(".") && !f.startsWith("_"));

    for (const f of files) {
      if (UNSUPPORTED.test(f)) {
        warnings.push(
          `${kind}/${model}/${f}: формат не открывается в браузере — нужен JPG или PNG`,
        );
      }
    }

    manifest[`${kind}/${model}`] = files
      .filter((f) => SHOWN.test(f))
      .sort(collator.compare);
  }
}

const json = JSON.stringify(manifest, null, 2) + "\n";
const changed = !existsSync(out) || readFileSync(out, "utf8") !== json;
if (changed) writeFileSync(out, json);

const total = Object.values(manifest).reduce((n, list) => n + list.length, 0);
console.log(
  `Опись фото: ${Object.keys(manifest).length} папок, ${total} файлов` +
    (changed ? " — обновлена" : " — без изменений"),
);
for (const w of warnings) console.warn(`  ⚠ ${w}`);
