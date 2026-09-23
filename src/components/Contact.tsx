"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/components/language/LanguageProvider";
import { useSiteContent } from "@/components/site-content/SiteContentProvider";

export default function Contact() {
  const { language } = useLanguage();
  const content = useSiteContent();

  const t = content[language].contact;

  return (
    <section
      id="contact"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-32"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/[0.035] blur-[160px]" />

      <div className="relative z-10 w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-4"
        >
          <span className="h-px w-10 bg-cyan-300/60" />

          <span className="text-[10px] uppercase tracking-[0.42em] text-cyan-300/60">
            {t.label}
          </span>
        </motion.div>

        <div className="mt-16 grid items-end gap-16 lg:grid-cols-[1fr_0.6fr] lg:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9 }}
          >
            <p className="mb-7 text-[10px] uppercase tracking-[0.45em] text-cyan-300/65">
              {t.signal}
            </p>

            <h2 className="font-[var(--font-syne)] text-[4rem] font-medium leading-[0.88] tracking-[-0.045em] text-[#F4F7FF] md:text-7xl lg:text-[8rem]">
              {t.title}

              {language === "EN" && "move" in t && (
                <>
                  <br />
                  <span className="text-white/25 transition-all duration-700 hover:text-cyan-300/80 hover:[text-shadow:0_0_45px_rgba(0,245,255,0.18)]">
                    {t.move}
                  </span>
                </>
              )}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="max-w-md"
          >
            <p className="text-sm leading-7 text-white/40 md:text-base">
              {t.description.first}
              <br />
              {t.description.second}
            </p>

            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=alienchord.official@gmail.com&su=Alien%20Chord%20Inquiry"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-10 inline-flex items-center gap-5"
            >
              <span className="flex h-12 items-center rounded-full border border-cyan-300/40 bg-cyan-300/[0.04] px-7 text-[11px] uppercase tracking-[0.3em] text-white transition-all duration-300 group-hover:border-cyan-300/80 group-hover:bg-cyan-300/[0.08] group-hover:shadow-[0_0_30px_rgba(34,211,238,0.12)] md:text-xs">
                {t.getInTouch}
              </span>

              <span className="text-cyan-300/60 transition-all duration-300 group-hover:translate-x-2 group-hover:text-cyan-300">
                →
              </span>
            </a>

            <a
              href="https://www.instagram.com/artem_zashchuk/"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-7 inline-flex items-center text-[11px] uppercase tracking-[0.3em] text-white/35 transition-colors duration-300 hover:text-cyan-300 md:text-xs"
            >
              {t.instagram}
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-32 flex flex-col items-start justify-between gap-4 border-t border-white/[0.08] pt-6 md:flex-row md:items-center"
        >
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/20">
            ALIEN CHORD
          </span>

          <span className="text-[9px] uppercase tracking-[0.3em] text-white/20">
            ELECTRONIC ARTIST / PRODUCER
          </span>

          <span className="text-[9px] uppercase tracking-[0.3em] text-cyan-300/40">
            03 — 03
          </span>
        </motion.div>
      </div>
    </section>
  );
}