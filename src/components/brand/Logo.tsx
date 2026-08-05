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
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  return (
    <Image
      src={logo}
      alt="BOW WOW COLLAR"
      priority
      className={cn(
        "h-7 w-auto",
        variant === "light" && "brightness-0 invert",
        className,
      )}
      sizes="200px"
    />
  );
}
