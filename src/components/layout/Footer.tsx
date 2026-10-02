import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import {
  FooterBackgroundGradient,
  TextHoverEffect,
} from "@/components/ui/hover-footer";
import { footerNav, isFilled, sellerLine, site } from "@/content/site";

/** Пустые реквизиты и шаблоны вроде «+375 (__) ___-__-__» не показываем */
const filled = isFilled;

/**
 * Почта-заглушка стоит на домене, которого у бренда нет: письмо туда
 * вернётся. Показываем её, только когда владелец подтвердит адрес —
 * тогда флаг переключается в site.ts.
 */
const emailConfirmed = site.contacts.emailConfirmed;

export function Footer() {
  return (
    <footer className="leather-texture relative mt-20 overflow-hidden bg-forest text-cream on-dark">
      {/* Полосатая кромка маркизы — тот же приём, что над шагами на главной */}
      <div aria-hidden className="stripes-rose relative z-10 h-3" />
      <FooterBackgroundGradient />

      <div className="wrap relative z-10 px-5 pt-14 pb-8 md:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo variant="light" className="h-9" />
            <p className="hand mt-4 max-w-xs text-2xl text-rose">
              {site.tagline}
            </p>
            <p className="mt-3 max-w-xs text-cream-muted">
              {site.city} и доставка по Беларуси.
            </p>
            <div className="mt-6 flex flex-col items-start md:gap-1">
              <a
                href={site.contacts.instagram}
                target="_blank"
                rel="noreferrer"
                className="display inline-flex min-h-11 items-center text-xl transition-colors hover:text-rose"
              >
                {site.contacts.instagramHandle}
              </a>
              {filled(site.contacts.phone) && (
              <a
                href={`tel:${site.contacts.phone.replace(/[^+\d]/g, "")}`}
                className="inline-flex min-h-11 items-center transition-colors hover:text-rose md:min-h-0 md:py-1"
              >
                {site.contacts.phone}
              </a>
              )}
              {emailConfirmed && (
              <a
                href={`mailto:${site.contacts.email}`}
                className="inline-flex min-h-11 items-center transition-colors hover:text-rose md:min-h-0 md:py-1"
              >
                {site.contacts.email}
              </a>
              )}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerNav.map((column) => (
              <div key={column.title}>
                <h2 className="hand text-2xl text-rose">{column.title}</h2>
                <ul className="mt-3 flex flex-col md:gap-1">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex min-h-11 items-center transition-colors hover:text-rose md:min-h-0 md:py-1"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Реквизиты показываем, только когда они заполнены. Пока в них
            стоит «ЗАПОЛНИТЬ», это слово читал каждый посетитель — лучше
            не показывать строку вовсе, чем показывать заглушку. */}
        <div className="mt-14 flex flex-col gap-2 border-t border-line-dark pt-6 text-xs text-cream-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}
            {`. ${sellerLine()}`}
          </p>
        </div>
      </div>

      {/* Крупный логотип: проявляется под курсором. Декоративный —
          настоящее название уже есть выше, поэтому скрыт от скринридеров */}
      <div
        aria-hidden
        className="relative z-10 -mt-10 hidden h-64 lg:flex"
      >
        <TextHoverEffect text="Bow Wow" duration={0.3} />
      </div>
    </footer>
  );
}
