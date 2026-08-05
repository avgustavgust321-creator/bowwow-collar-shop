"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { getProduct } from "@/lib/catalog";
import { calcPrice, type Configuration } from "@/lib/price";
import type { Product } from "@/lib/product-schema";

export type CartLine = {
  /** Стабильный ключ: одинаковая конфигурация складывается в одну строку */
  key: string;
  slug: string;
  config: Configuration;
  qty: number;
};

const STORAGE_KEY = "bowwow.cart.v1";

/** Ключ строки собирается из товара и конфигурации, порядок полей нормализуется. */
export function lineKey(slug: string, config: Configuration): string {
  const normalized = {
    fit: config.fit,
    sizeCode: config.sizeCode ?? "",
    measurements: Object.fromEntries(
      Object.entries(config.measurements ?? {}).sort(([a], [b]) =>
        a.localeCompare(b),
      ),
    ),
    leather: Object.fromEntries(
      Object.entries(config.leather).sort(([a], [b]) => a.localeCompare(b)),
    ),
    hardware: config.hardware ?? "",
    engraving: config.engraving?.trim() ?? "",
  };
  return `${slug}|${JSON.stringify(normalized)}`;
}

type CartContextValue = {
  lines: CartLine[];
  count: number;
  total: number;
  /** Есть ли позиции с предварительной ценой — сумма тоже предварительная */
  approximate: boolean;
  ready: boolean;
  add: (slug: string, config: Configuration, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStorage(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Отбрасываем позиции на товары, которых больше нет в каталоге.
    return (parsed as CartLine[]).filter(
      (line) => line?.slug && getProduct(line.slug) && line.qty > 0,
    );
  } catch {
    return [];
  }
}

/**
 * На сервере корзины нет, на клиенте есть. Флаг гидрации получаем через
 * useSyncExternalStore: разметка сервера и первого клиентского рендера
 * совпадает, а setState в эффекте не нужен.
 */
function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const ready = useHydrated();
  const [lines, setLines] = useState<CartLine[]>(() =>
    typeof window === "undefined" ? [] : readStorage(),
  );

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const add = useCallback(
    (slug: string, config: Configuration, qty = 1) => {
      const key = lineKey(slug, config);
      setLines((prev) => {
        const existing = prev.find((l) => l.key === key);
        if (existing) {
          return prev.map((l) =>
            l.key === key ? { ...l, qty: Math.min(l.qty + qty, 99) } : l,
          );
        }
        return [...prev, { key, slug, config, qty }];
      });
    },
    [],
  );

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.key !== key)
        : prev.map((l) => (l.key === key ? { ...l, qty: Math.min(qty, 99) } : l)),
    );
  }, []);

  const remove = useCallback((key: string) => {
    setLines((prev) => prev.filter((l) => l.key !== key));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const { total, approximate, count } = useMemo(() => {
    let sum = 0;
    let approx = false;
    let items = 0;
    for (const line of lines) {
      const product = getProduct(line.slug);
      if (!product) continue;
      const price = calcPrice(product, line.config);
      sum += price.total * line.qty;
      approx = approx || price.approximate;
      items += line.qty;
    }
    return { total: sum, approximate: approx, count: items };
  }, [lines]);

  const value = useMemo(
    () => ({ lines, count, total, approximate, ready, add, setQty, remove, clear }),
    [lines, count, total, approximate, ready, add, setQty, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart вызван вне CartProvider");
  return ctx;
}

/** Товар строки корзины — удобный хелпер, чтобы не тянуть каталог в каждый компонент. */
export function lineProduct(line: CartLine): Product | undefined {
  return getProduct(line.slug);
}
