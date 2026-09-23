"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/language/LanguageProvider";
import { useSiteContent } from "@/components/site-content/SiteContentProvider";

export default function Hero() {
  const { language } = useLanguage();
  const content = useSiteContent();

  const t = content[language].hero;


  return (
    <section
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
      "
    >
      <div className="hero-glow pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 flex -translate-y-8 flex-col items-center px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 25, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="
            font-[var(--font-syne)]
            text-5xl
            font-semibold
            leading-none
            tracking-[0.16em]
            text-[#F4F7FF]
            drop-shadow-[0_0_25px_rgba(34,211,238,0.22)]
            sm:text-6xl
            md:text-8xl
            md:tracking-[0.22em]
            lg:text-[7rem]
          "
        >
          ALIEN CHORD
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
          className="
            mt-5
            font-[var(--font-inter)]
            text-[10px]
            uppercase
            tracking-[0.35em]
            text-white/40
            sm:text-xs
            md:text-sm
          "
        >
          {t.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.65, ease: "easeOut" }}
          className="mt-7 h-px w-12 origin-center bg-cyan-300/50 shadow-[0_0_12px_rgba(103,232,249,0.5)]"
        />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
        >
          <Link
            href="#latest-release"
            className="group relative mt-10 inline-flex items-center gap-4 overflow-hidden rounded-full border border-cyan-300/30 bg-cyan-300/[0.04] px-8 py-3.5 text-[10px] uppercase tracking-[0.3em] text-cyan-200 backdrop-blur-md transition-all duration-500 hover:border-cyan-300/70 hover:bg-cyan-300/[0.08] hover:text-white hover:shadow-[0_0_35px_rgba(34,211,238,0.12)]"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyan-300/[0.08] to-transparent transition-transform duration-700 group-hover:translate-x-full" />

            <span className="relative z-10">{t.listen}</span>

            <span className="relative z-10 text-cyan-300/60 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-cyan-300">
              →
            </span>
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="text-[8px] uppercase tracking-[0.4em] text-white/20">
          {t.scroll}
        </span>

        <span className="h-8 w-px bg-gradient-to-b from-cyan-300/40 to-transparent" />
      </motion.div>
    </section>
  );
}