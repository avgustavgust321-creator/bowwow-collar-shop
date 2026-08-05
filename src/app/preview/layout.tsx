import type { Metadata } from "next";

/**
 * Витрина вариантов дизайна: две версии главной страницы на отдельных
 * адресах, чтобы сравнить их глазами. Из поиска закрыты — это черновики,
 * а не страницы магазина.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
