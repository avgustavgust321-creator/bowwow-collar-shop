/**
 * Палитра пластика для изделий, напечатанных на 3D-принтере (миски).
 *
 * Оттенки сняты пипеткой с палитры, которую прислал владелец, в том же
 * порядке: по рядам слева направо. Названия — описательные: у кожи
 * имена фирменные («Слизерин», «Тиффани»), а у пластика их нет. Если
 * захотите дать и пластику свои имена — меняйте поле name, id не трогайте:
 * по нему к цвету привязываются фотографии и заказы.
 */
import type { SwatchColor } from "@/content/leather";

export const plasticColors: SwatchColor[] = [
  { id: "belyj", name: "Белый", hex: "#FFFFFF" },
  { id: "bezhevyj", name: "Бежевый", hex: "#CCC4B9" },
  { id: "zheltyj", name: "Жёлтый", hex: "#F7D955" },
  { id: "persikovyj", name: "Персиковый", hex: "#FA9964" },
  { id: "rozovyj", name: "Розовый", hex: "#E8AFCF" },
  { id: "sirenevyj", name: "Сиреневый", hex: "#AF95D2" },
  { id: "fuksiya", name: "Фуксия", hex: "#950051", dark: true },

  { id: "krasnyj", name: "Красный", hex: "#DF4140", dark: true },
  { id: "vishnevyj", name: "Вишнёвый", hex: "#BA3B44", dark: true },
  { id: "salatovyj", name: "Салатовый", hex: "#C4E08C" },
  { id: "zelenyj", name: "Зелёный", hex: "#63C683" },
  { id: "oliva", name: "Олива", hex: "#69714C", dark: true },
  { id: "goluboj", name: "Голубой", hex: "#A3D7E2" },
  { id: "nebesnyj", name: "Небесный", hex: "#58B9E6" },

  { id: "sinij", name: "Синий", hex: "#0177BF", dark: true },
  { id: "temno-sinij", name: "Тёмно-синий", hex: "#042F59", dark: true },
  { id: "vanilnyj", name: "Ванильный", hex: "#E6D9B6" },
  { id: "pudrovyj", name: "Пудровый", hex: "#D4B8AA" },
  { id: "karamel", name: "Карамель", hex: "#AD815A", dark: true },
  { id: "terrakota", name: "Терракота", hex: "#B25335", dark: true },
  { id: "kakao", name: "Какао", hex: "#7E6455", dark: true },

  { id: "shokoladnyj", name: "Шоколадный", hex: "#4E3224", dark: true },
  { id: "svetlo-seryj", name: "Светло-серый", hex: "#9A9E9F" },
  { id: "seryj", name: "Серый", hex: "#757575", dark: true },
  { id: "chernyj", name: "Чёрный", hex: "#010101", dark: true },
];

export const plasticById = new Map(plasticColors.map((c) => [c.id, c]));
