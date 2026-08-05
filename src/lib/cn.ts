import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Склейка классов.
 *
 * clsx принимает строки, массивы и объекты вида { "класс": условие } —
 * именно в таком виде их передают готовые компоненты shadcn.
 * twMerge разрешает конфликты: из «px-4 px-8» останется последний,
 * иначе переопределить отступ у чужого компонента было бы нельзя.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
