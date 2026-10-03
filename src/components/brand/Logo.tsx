import Image from "next/image";
import { cn } from "@/lib/cn";
import logo from "../../../public/brand/logo.png";

/**
 * Логотип бренда. Исходник чёрный на прозрачном фоне,
 * поэтому светлая версия для тёмных секций делается фильтром,
 * без отдельного файла.
 */
export function Logo({
  className,
  variant = "dark",
  priority = false,
}: {
  className?: string;
  variant?: "dark" | "light";
  /** Только для логотипа в шапке: он в первом экране. Копия в подвале
   *  грузится лениво, иначе она тянется вместе со страницей зря. */
  priority?: boolean;
}) {
  return (
    <Image
      src={logo}
      alt="BOW WOW COLLAR"
      loading={priority ? "eager" : "lazy"}
      className={cn(
        "h-7 w-auto",
        variant === "light" && "brightness-0 invert",
        className,
      )}
      sizes="200px"
    />
  );
}
