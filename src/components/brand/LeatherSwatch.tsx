import { cn } from "@/lib/cn";
import type { LeatherColor } from "@/content/leather";

/**
 * Образец кожи: цвет плюс настоящее зерно, снятое с фотографии образцов.
 *
 * Текстура одна на все цвета — серая, нейтральная, — и накладывается
 * режимом overlay поверх заливки. Так двенадцать цветов перестают быть
 * плоскими кружками и начинают выглядеть материалом.
 */
export function LeatherSwatch({
  color,
  className,
  rounded = "square",
}: {
  color: LeatherColor;
  className?: string;
  rounded?: "square" | "full";
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        rounded === "full" ? "rounded-full" : "rounded-lg",
        className,
      )}
      style={{ backgroundColor: color.hex }}
    >
      <div
        aria-hidden
        className="absolute inset-0 mix-blend-overlay opacity-70"
        style={{
          backgroundImage: "url(/images/sajt/faktury/leather-grain.png)",
          backgroundSize: "150px 150px",
        }}
      />
      {/* Мягкий блик сверху — кожа отражает свет, плоская заливка нет */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(255,255,255,0.22), transparent 45%, rgba(0,0,0,0.16))",
        }}
      />
    </div>
  );
}
