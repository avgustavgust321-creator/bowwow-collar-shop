import { LeatherSwatch } from "@/components/brand/LeatherSwatch";
import { selectableLeatherColors } from "@/content/leather";

/**
 * Книга образцов кожи.
 *
 * Двенадцать оттенков с придуманными именами — самое узнаваемое, что есть
 * у бренда: «Слизерин» и «Тиффани» больше нигде не купишь. Сеткой одинаковых
 * квадратиков это выглядело как палитра в интерфейсе. Здесь они собраны
 * полосами во всю высоту, как настоящий веер образцов у мастера: имя идёт
 * вдоль полосы, под курсором полоса раскрывается шире соседних.
 *
 * На узком экране веер прокручивается вбок — так же, как перебирают
 * образцы руками.
 */
export function LeatherDeck() {
  return (
    <div
      className="flex h-[58vh] min-h-[340px] gap-px overflow-x-auto bg-forest md:overflow-x-hidden"
      role="list"
      aria-label="Цвета кожи"
    >
      {selectableLeatherColors.map((color) => (
        <div
          key={color.id}
          role="listitem"
          className="group relative w-16 shrink-0 overflow-hidden md:w-auto md:shrink md:basis-0 md:grow md:transition-[flex-grow] md:duration-500 md:ease-out md:hover:grow-[2.2]"
        >
          <LeatherSwatch
            color={color}
            className="absolute inset-0 rounded-none"
          />
          {/*
            Имя лежит на отдельной табличке внизу полосы, а не прямо на коже.
            Прямо на коже оно и не могло работать: у средних по светлоте
            оттенков — «Такси», «Лилу», «Пепа», «Нарния» — не проходит ни
            светлая подпись, ни тёмная. На образцах у мастера имя тоже
            печатают на отдельной планке.
          */}
          <div className="absolute inset-x-0 bottom-0 flex h-32 items-end justify-center bg-forest-lift pb-4">
            <span className="label rotate-180 text-cream [writing-mode:vertical-rl]">
              {color.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
