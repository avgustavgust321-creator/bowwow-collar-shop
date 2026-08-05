"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Подписка на медиавыражение без setState в эффекте: на сервере всегда
 * false, на клиенте — реальное значение, которое обновляется при смене
 * настроек системы или размера окна.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Человек попросил систему меньше двигать интерфейс. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/**
 * Смонтирован ли компонент на клиенте.
 *
 * Нужен там, где разметка зависит от document — например, порталы.
 * Через useSyncExternalStore, а не setState в эффекте: на сервере
 * возвращает false, на клиенте сразу true, лишнего рендера нет.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
