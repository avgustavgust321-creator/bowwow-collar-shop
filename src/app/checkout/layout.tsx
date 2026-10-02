import type { Metadata } from "next";

// Страница клиентская, поэтому название вкладки задаётся здесь
export const metadata: Metadata = {
  title: "Оформление заказа",
  robots: { index: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
