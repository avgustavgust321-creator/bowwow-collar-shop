/**
 * Галерея «Собаки» (/dogs): наши изделия на собаках.
 *
 * КАК ДОБАВИТЬ СВОЮ: положите файл в public/images/sajt/sobaki/ и впишите
 * сюда строку. Ширина и высота — размеры файла в пикселях, по ним сайт
 * заранее оставляет место под фото, чтобы страница не прыгала при загрузке.
 * Порядок в массиве — порядок на странице (раскладка идёт по колонкам).
 *
 * product — модель на снимке, под фото появится ссылка на неё. Если модель
 * не видна или не уверены, просто не указывайте: снимок останется без подписи.
 */

export type DogPhoto = {
  src: string;
  width: number;
  height: number;
  /** Что на снимке — для незрячих и для поиска картинок */
  alt: string;
  /** slug товара из src/content/products.ts */
  product?: string;
};

const dir = "/images/sajt/sobaki";

export const dogPhotos: DogPhoto[] = [
  { src: `${dir}/bigl-portret.jpg`, width: 900, height: 1347, alt: "Бигль в красном ошейнике с латунной пряжкой и адресником", product: "collar-solid" },
  { src: `${dir}/bulli-na-rukah.jpg`, width: 900, height: 1200, alt: "Мраморный булли на руках, красный поводок с голубой обмоткой", product: "leash-adjustable" },
  { src: `${dir}/siba.jpg`, width: 900, height: 1350, alt: "Сиба-ину в рыжей кожаной шлейке на прогулке", product: "harness-4-buckle" },
  { src: `${dir}/pudel.jpg`, width: 900, height: 1600, alt: "Светлый пудель, бежевый шнур с кожаными вставками", product: "leash-lap" },
  { src: `${dir}/aussi-sneg.jpg`, width: 900, height: 1200, alt: "Австралийская овчарка на снегу в бирюзовом ошейнике", product: "collar-solid" },
  { src: `${dir}/bulli-ruchka.jpg`, width: 853, height: 1066, alt: "Булли сидит рядом с хозяйкой, поводок с плоской кожаной ручкой", product: "leash-flat-handle" },
  { src: `${dir}/belyj-na-trave.jpg`, width: 900, height: 1350, alt: "Белая собака лежит на осенней траве, рядом свёрнут поводок" },
  { src: `${dir}/kavaler-dai-pyat.jpg`, width: 900, height: 1522, alt: "Кавалер-кинг-чарльз-спаниель даёт лапу" },
  { src: `${dir}/bigl-v-kurtke.jpg`, width: 900, height: 1347, alt: "Бигль в курточке с лисами и красном ошейнике", product: "collar-solid" },
  { src: `${dir}/bulli-lap.jpg`, width: 900, height: 1200, alt: "Булли на улице, красный шнур и серая кожаная ручка с кисточкой", product: "leash-lap" },
  { src: `${dir}/chihuahua.jpg`, width: 900, height: 1350, alt: "Длинношёрстная чихуахуа в рыжей шлейке", product: "harness-4-buckle" },
  { src: `${dir}/korgi.jpg`, width: 900, height: 1350, alt: "Корги на брусчатке смотрит в камеру" },
  { src: `${dir}/aussi-shchenok.jpg`, width: 900, height: 1200, alt: "Щенок австралийской овчарки в бирюзовом ошейнике", product: "collar-solid" },
  { src: `${dir}/bulli-v-svitere.jpg`, width: 900, height: 1350, alt: "Булли в свитере у столика кафе" },
  { src: `${dir}/s-loshadmi.jpg`, width: 900, height: 1350, alt: "Хозяйка с белой собакой на поводке гуляет у пастбища с лошадьми" },
  { src: `${dir}/v-obnimku.jpg`, width: 900, height: 1350, alt: "Мужчина в клетчатой рубашке обнимает собаку" },
  { src: `${dir}/kavaler-na-taburete.jpg`, width: 900, height: 1350, alt: "Кавалер-кинг-чарльз-спаниель сидит на деревянном табурете" },
  { src: `${dir}/korgi-shlejka.jpg`, width: 900, height: 1350, alt: "Корги в рыжей шлейке на траве, вид сбоку", product: "harness-4-buckle" },
  { src: `${dir}/v-telnyashke.jpg`, width: 900, height: 1200, alt: "Собака в тельняшке и красном ошейнике с бусами", product: "collar-solid" },
  { src: `${dir}/kavaler-s-kofe.jpg`, width: 900, height: 1350, alt: "Кавалер-кинг-чарльз-спаниель на руках у хозяина с кофе" },
  { src: `${dir}/bigl-s-malyshom.jpg`, width: 900, height: 1347, alt: "Бигль в курточке рядом с малышом в комбинезоне", product: "collar-solid" },
  { src: `${dir}/buldog.jpg`, width: 900, height: 1350, alt: "Бульдог в коричневом ошейнике у ног хозяина" },
];
