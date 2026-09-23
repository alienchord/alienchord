
"use client";

import Link from "next/link";
import LanguageSwitcher from "@/components/language/LanguageSwitcher";
import { useLanguage } from "@/components/language/LanguageProvider";
import { useSiteContent } from "@/components/site-content/SiteContentProvider";

const navItems = [
  {
    key: "music",
    href: "/music",
  },
  {
    key: "visuals",
    href: "/visuals",
  },
  {
    key: "about",
    href: "/#about",
  },
  {
    key: "contact",
    href: "/#contact",
  },
] as const;

export default function Navbar() {
  const { language } = useLanguage();

  const content = useSiteContent();
const t = content[language].nav;

  return (
    <nav
      className="
        fixed
        top-0
        left-0
        z-50
        w-full
        bg-black/20
        px-4
        py-3
        backdrop-blur-xl
        border-b
        border-white/[0.08]
        shadow-[0_10px_40px_rgba(0,0,0,0.35)]
        md:px-10
        md:py-6
      "
    >
      <div
        className="
          flex
          w-full
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
        "
      >
        {/* TOP ROW */}

        <div
          className="
            flex
            w-full
            items-center
            justify-between
            md:w-auto
          "
        >
          {/* LOGO */}

          <Link
            href="/"
            className="
              group
              relative
              shrink-0
              font-[var(--font-syne)]
              text-[15px]
              font-medium
              tracking-[0.18em]
              text-white/80
              transition-colors
              duration-300
              hover:text-white
              md:text-lg
              md:tracking-[0.22em]
            "
          >
            ALIEN CHORD

            <span
              className="
                absolute
                left-0
                -bottom-1
                h-px
                w-0
                bg-cyan-300
                shadow-[0_0_10px_rgba(0,245,255,0.7)]
                transition-all
                duration-500
                group-hover:w-full
              "
            />
          </Link>

          {/* MOBILE LANGUAGE */}

          <div
            className="
              md:hidden
              border-l
              border-white/[0.08]
              pl-3
            "
          >
            <LanguageSwitcher />
          </div>
        </div>

        {/* NAVIGATION */}

        <div
          className="
            mt-3
            flex
            w-full
            items-center
            justify-end
            gap-3
            font-[var(--font-inter)]
            text-[10px]
            tracking-normal
            text-white/60
            sm:gap-4
            sm:text-[11px]
            md:mt-0
            md:w-auto
            md:gap-8
            md:text-sm
            md:tracking-wide
          "
        >
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="
                group
                relative
                whitespace-nowrap
                py-1
                transition-colors
                duration-300
                hover:text-cyan-300
              "
            >
              {t[item.key]}

              <span
                className="
                  absolute
                  left-1/2
                  -bottom-1
                  h-px
                  w-0
                  -translate-x-1/2
                  bg-cyan-300
                  shadow-[0_0_8px_rgba(0,245,255,0.7)]
                  transition-all
                  duration-300
                  group-hover:w-full
                "
              />
            </Link>
          ))}

          {/* DESKTOP LANGUAGE */}

          <div
            className="
              hidden
              border-l
              border-white/[0.08]
              md:block
              md:pl-5
            "
          >
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}

