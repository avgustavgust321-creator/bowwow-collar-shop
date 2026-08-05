"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const variants = [
  { href: "/preview/material", label: "Материальная" },
  { href: "/preview/premium", label: "Премиум" },
  { href: "/", label: "Нынешняя" },
];

/** Переключатель между версиями главной — только для сравнения. */
export function VariantSwitch() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-4 left-1/2 z-[100] -translate-x-1/2">
      <div className="flex items-center gap-1 rounded-full border border-black/10 bg-white/90 p-1 shadow-lg backdrop-blur">
        {variants.map((v) => (
          <Link
            key={v.href}
            href={v.href}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              pathname === v.href
                ? "bg-neutral-900 text-white"
                : "text-neutral-700 hover:bg-neutral-100",
            )}
          >
            {v.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
