import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import {
  FooterBackgroundGradient,
  TextHoverEffect,
} from "@/components/ui/hover-footer";
import { footerNav, site } from "@/content/site";

export function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden bg-forest text-paper">
      <FooterBackgroundGradient />

      <div className="relative z-10 px-5 pt-14 pb-8 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo variant="light" className="h-9" />
            <p className="hand mt-4 max-w-xs text-2xl text-brass">
              {site.tagline}
            </p>
            <p className="mt-3 max-w-xs text-muted">
              {site.city} и доставка по Беларуси.
            </p>
            <div className="mt-6 flex flex-col gap-1">
              <a
                href={site.contacts.instagram}
                target="_blank"
                rel="noreferrer"
                className="display text-xl transition-colors hover:text-brass"
              >
                {site.contacts.instagramHandle}
              </a>
              <a
                href={`tel:${site.contacts.phone.replace(/[^+\d]/g, "")}`}
                className="transition-colors hover:text-brass"
              >
                {site.contacts.phone}
              </a>
              <a
                href={`mailto:${site.contacts.email}`}
                className="transition-colors hover:text-brass"
              >
                {site.contacts.email}
              </a>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerNav.map((column) => (
              <div key={column.title}>
                <h2 className="hand text-2xl text-brass">{column.title}</h2>
                <ul className="mt-3 flex flex-col gap-2">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="transition-colors hover:text-brass"
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

        <div className="mt-14 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. {site.legal.entity}, УНП{" "}
            {site.legal.unp}
          </p>
          <p>{site.legal.registry}</p>
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
