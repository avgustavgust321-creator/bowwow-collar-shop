"use client";
import React from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Droplets,
  FileText,
  HelpCircle,
  Layers,
  Link2,
  PawPrint,
  Ruler,
  Shield,
  Sparkles,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useCart } from "@/components/cart/CartProvider";
import { Logo } from "@/components/brand/Logo";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/lib/use-media-query";

/**
 * Шапка с выпадающими разделами.
 *
 * АДАПТАЦИЯ: демонстрационные пункты (Product, Company, Sign In) заменены
 * на настоящую навигацию магазина. Раньше все разделы висели одним рядом
 * плоских ссылок — теперь категории и справочные страницы собраны в два
 * выпадающих списка, а верхний ряд стал короче.
 */

type LinkItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

export function Header() {
  const [open, setOpen] = React.useState(false);
  const scrolled = useScroll(10);
  const { count, ready } = useCart();

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Закрываем меню при переходе: портал живёт вне дерева страницы
  const closeMenu = () => setOpen(false);

  // Шапка всегда кремовая, а не прозрачная до прокрутки: раньше она
  // проявлялась только при прокрутке, и на главной светлый логотип
  // оказывался на светлой плашке — то есть исчезал.
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border bg-background/92 backdrop-blur-lg transition-colors",
        {
          "supports-[backdrop-filter]:bg-background/75": !scrolled && !open,
        },
      )}
    >
      <nav className="mx-auto flex h-14 w-full items-center justify-between px-5 md:px-10">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            aria-label="На главную"
            onClick={closeMenu}
            className="inline-flex min-h-11 items-center rounded-xs px-1 hover:bg-accent"
          >
            <Logo className="h-5" priority />
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="label bg-transparent">
                  Каталог
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-background p-1 pr-1.5">
                  <ul className="grid w-[34rem] grid-cols-2 gap-2 rounded-xs border border-border bg-popover p-2 shadow">
                    {catalogLinks.map((item) => (
                      <li key={item.title}>
                        <ListItem {...item} />
                      </li>
                    ))}
                  </ul>
                  <div className="p-2">
                    <p className="text-sm text-muted-foreground">
                      Не знаете размер?{" "}
                      <Link
                        href="/sizing"
                        className="font-medium text-foreground hover:underline"
                      >
                        Снимите четыре мерки
                      </Link>
                    </p>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="label bg-transparent">
                  Помощь
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-background p-1 pr-1.5 pb-1.5">
                  <div className="grid w-[34rem] grid-cols-2 gap-2">
                    <ul className="space-y-2 rounded-xs border border-border bg-popover p-2 shadow">
                      {helpLinks.map((item) => (
                        <li key={item.title}>
                          <ListItem {...item} />
                        </li>
                      ))}
                    </ul>
                    <ul className="space-y-1 p-3">
                      {aboutLinks.map((item) => (
                        <li key={item.title}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={item.href}
                              className="flex flex-row items-center gap-x-2 rounded-xs p-2 hover:bg-accent"
                            >
                              <item.icon className="size-4 text-forest" />
                              <span className="text-sm">{item.title}</span>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuLink asChild>
                <Link
                  href="/collections"
                  className="label rounded-xs px-4 py-2 hover:bg-accent"
                >
                  Коллекции
                </Link>
              </NavigationMenuLink>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="outline" className="label" asChild>
            <Link href="/cart">Корзина ({ready ? count : 0})</Link>
          </Button>
          <Button className="label" asChild>
            <Link href="/catalog">Собрать ошейник</Link>
          </Button>
        </div>

        <Button
          size="icon"
          variant="outline"
          onClick={() => setOpen(!open)}
          className="md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Открыть меню"
        >
          <MenuToggleIcon open={open} className="size-5" duration={300} />
        </Button>
      </nav>

      <MobileMenu
        open={open}
        className="flex flex-col justify-between gap-2 overflow-y-auto"
      >
        <div className="flex w-full flex-col gap-y-1">
          <span className="label mt-2 text-forest">Каталог</span>
          {catalogLinks.map((link) => (
            <ListItem key={link.title} {...link} onClick={closeMenu} plain />
          ))}

          <span className="label mt-5 text-forest">Помощь</span>
          {helpLinks.map((link) => (
            <ListItem key={link.title} {...link} onClick={closeMenu} plain />
          ))}

          <span className="label mt-5 text-forest">Бренд</span>
          {aboutLinks.map((link) => (
            <ListItem key={link.title} {...link} onClick={closeMenu} plain />
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-2 pb-4">
          <Button variant="outline" className="label w-full" asChild>
            <Link href="/cart" onClick={closeMenu}>
              Корзина ({ready ? count : 0})
            </Link>
          </Button>
          <Button className="label w-full" asChild>
            <Link href="/catalog" onClick={closeMenu}>
              Собрать ошейник
            </Link>
          </Button>
          <a
            href={site.contacts.instagram}
            target="_blank"
            rel="noreferrer"
            className="label mt-2 text-center text-muted-foreground"
          >
            {site.contacts.instagramHandle}
          </a>
        </div>
      </MobileMenu>
    </header>
  );
}

type MobileMenuProps = React.ComponentProps<"div"> & {
  open: boolean;
};

function MobileMenu({ open, children, className, ...props }: MobileMenuProps) {
  const mounted = useHydrated();

  if (!open || !mounted) return null;

  return createPortal(
    <div
      id="mobile-menu"
      className={cn(
        "bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/85",
        "fixed top-14 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-y border-border md:hidden",
      )}
    >
      <div
        data-slot={open ? "open" : "closed"}
        className={cn(
          "ease-out data-[slot=open]:animate-in data-[slot=open]:zoom-in-97",
          "size-full p-4",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

function ListItem({
  title,
  description,
  icon: Icon,
  className,
  href,
  onClick,
  plain = false,
}: LinkItem & {
  className?: string;
  onClick?: () => void;
  /**
   * true — рисуем обычную ссылку. NavigationMenuLink требует контекста
   * своего меню, и в мобильной панели (она живёт в портале, вне
   * NavigationMenu) он валит страницу.
   */
  plain?: boolean;
}) {
  const content = (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex w-full flex-row gap-x-3 rounded-xs p-2 hover:bg-accent hover:text-accent-foreground",
        className,
      )}
    >
      <div className="flex aspect-square size-11 items-center justify-center rounded-xs border border-border bg-background/40">
        <Icon className="size-5 text-forest" />
      </div>
      <div className="flex flex-col items-start justify-center">
        <span className="text-sm font-medium">{title}</span>
        {description && (
          <span className="text-xs text-muted-foreground">{description}</span>
        )}
      </div>
    </Link>
  );

  if (plain) return content;
  return <NavigationMenuLink asChild>{content}</NavigationMenuLink>;
}

const catalogLinks: LinkItem[] = [
  {
    title: "Ошейники",
    href: "/catalog?category=collars",
    description: "Однотонные и с цветным подкладом",
    icon: PawPrint,
  },
  {
    title: "Шлейки",
    href: "/catalog?category=harnesses",
    description: "На четыре пряжки, по вашим замерам",
    icon: Layers,
  },
  {
    title: "Поводки",
    href: "/catalog?category=leashes",
    description: "Lap, перестёжки и с плоской ручкой",
    icon: Link2,
  },
  {
    title: "Аксессуары",
    href: "/catalog?category=accessories",
    description: "Холдеры и мелочи для прогулки",
    icon: Sparkles,
  },
  {
    title: "Весь каталог",
    href: "/catalog",
    description: "Все изделия сразу",
    icon: BookOpen,
  },
  {
    title: "Коллекции",
    href: "/collections",
    description: "Изделия, собранные по линейкам",
    icon: Droplets,
  },
];

const helpLinks: LinkItem[] = [
  {
    title: "Как замерить",
    href: "/sizing",
    description: "Четыре мерки и инструкция",
    icon: Ruler,
  },
  {
    title: "Доставка и оплата",
    href: "/delivery",
    description: "Европочта, курьер, самовывоз",
    icon: Truck,
  },
  {
    title: "Уход за кожей",
    href: "/care",
    description: "Чтобы вещь служила годами",
    icon: Droplets,
  },
];

const aboutLinks: LinkItem[] = [
  { title: "О мастерской", href: "/about", icon: PawPrint },
  { title: "Частые вопросы", href: "/faq", icon: HelpCircle },
  { title: "Публичная оферта", href: "/offer", icon: FileText },
  { title: "Обработка данных", href: "/policy", icon: Shield },
];

function useScroll(threshold: number) {
  const [scrolled, setScrolled] = React.useState(false);

  const onScroll = React.useCallback(() => {
    setScrolled(window.scrollY > threshold);
  }, [threshold]);

  React.useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  return scrolled;
}
