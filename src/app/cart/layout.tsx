import type { Metadata } from "next";

// Страница клиентская, поэтому название вкладки задаётся здесь
export const metadata: Metadata = {
  title: "Корзина",
  robots: { index: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
