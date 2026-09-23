"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/components/language/LanguageProvider";
import { useSiteContent } from "@/components/site-content/SiteContentProvider";

export default function About() {
  const { language } = useLanguage();
  const content = useSiteContent();

  const t = content[language].about;console.log(
  "ABOUT CONTENT:",
  language,
  t.label,
  t.role,
  t.description,
  t.experience,
  t.footer
);


  return (
    <section
      id="about"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-32 md:px-10"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/[0.06] blur-[140px]" />

      <div className="relative z-10 w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="mb-16 flex items-center gap-4"
        >
          <span className="h-px w-10 bg-cyan-300/60" />

          <span className="text-[11px] uppercase tracking-[0.4em] text-white/40">
            {t.label}
          </span>
        </motion.div>

        <div className="grid items-end gap-16 lg:grid-cols-[1fr_0.7fr] lg:gap-24">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8 }}
              className="text-[11px] uppercase tracking-[0.35em] text-cyan-300/75"
            >
              {t.role}
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="mt-6 font-[var(--font-syne)] text-5xl font-medium leading-[0.95] tracking-[0.08em] text-[#F4F7FF] md:text-7xl lg:text-8xl"
            >
              ALIEN
              <br />
              CHORD
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-lg"
          >
            <p className="text-xl leading-relaxed text-white/70 md:text-2xl">
              {t.statement.first}
              <br />
              <span className="text-white">
                {t.statement.second}
              </span>
            </p>

            <p className="mt-8 text-base leading-8 text-white/40 md:text-lg">
              {t.description}
            </p>

            <div className="mt-10 flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-white/40 md:text-[11px]">
              <span className="h-px w-8 bg-white/20" />
              <span>{t.experience}</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, delay: 0.35 }}
          className="mt-24 flex items-center justify-between border-t border-white/[0.08] pt-6"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/25">
            {t.footer}
          </span>

          <span className="text-[10px] uppercase tracking-[0.3em] text-cyan-300/40">
            02 — 03
          </span>
        </motion.div>
      </div>
    </section>
  );
}