"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/components/language/LanguageProvider";
import { useSiteContent } from "@/components/site-content/SiteContentProvider";

export function VisualsPreview() {
  const [isHovered, setIsHovered] = useState(false);

  const { language } = useLanguage();
  const content = useSiteContent();

  const visualsPreview =
    content?.[language]?.visualsPreview;

  const image =
    visualsPreview?.image ||
    "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=2200&q=85";

  const label =
    visualsPreview?.label || "Visuals";

  const counter =
    visualsPreview?.counter || "01 / 03";

  const topLabel =
    visualsPreview?.topLabel ||
    "SOUND / MOTION / IDENTITY";

  const explore =
    visualsPreview?.explore || "Explore";

  const eyebrow =
    visualsPreview?.eyebrow ||
    "Alien Chord / Visuals";

  const titleFirst =
    visualsPreview?.titleFirst || "SOUND";

  const titleSecond =
    visualsPreview?.titleSecond || "BECOMES";

  const titleThird =
    visualsPreview?.titleThird || "SIGNAL.";

  const description =
    visualsPreview?.description ||
    "Visuals built around sound, movement and identity. A different way to experience Alien Chord.";

  const enterVisuals =
    visualsPreview?.enterVisuals || "Enter Visuals";

  const bottomLabel =
    visualsPreview?.bottomLabel ||
    "MUSIC / MOTION / IDENTITY";

  return (
    <section
      id="visuals-preview"
      className="
        relative
        min-h-screen
        overflow-hidden
        px-6
        py-24
        md:py-32
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[600px]
          w-[600px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-cyan-400/[0.06]
          blur-[140px]
        "
      />

      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-10 flex items-center justify-between">
          <p
            className="
              font-[var(--font-inter)]
              text-[11px]
              uppercase
              tracking-[0.35em]
              text-cyan-300/60
            "
          >
            {label}
          </p>

          <p
            className="
              font-[var(--font-inter)]
              text-[11px]
              uppercase
              tracking-[0.25em]
              text-white/25
            "
          >
            {counter}
          </p>
        </div>

        <Link
          href="/visuals"
          className="group block"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className="
              relative
              min-h-[70vh]
              overflow-hidden
              rounded-[2rem]
              border
              border-white/10
              bg-[#090b0d]
            "
          >
            <img
              src={image}
              alt="Alien Chord Visuals"
              className={`
                absolute
                inset-0
                h-full
                w-full
                object-cover
                transition-all
                duration-[1200ms]
                ease-out
                ${
                  isHovered
                    ? "scale-[1.06] opacity-70"
                    : "scale-100 opacity-50"
                }
              `}
            />

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-b
                from-black/30
                via-black/35
                to-black/85
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -right-32
                top-1/2
                h-[500px]
                w-[500px]
                -translate-y-1/2
                rounded-full
                bg-cyan-400/[0.08]
                blur-[120px]
                transition-all
                duration-1000
                group-hover:bg-cyan-300/[0.14]
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                opacity-[0.07]
                [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)]
                [background-size:80px_80px]
              "
            />

            <div
              className="
                relative
                flex
                min-h-[70vh]
                flex-col
                justify-between
                p-7
                md:p-12
              "
            >
              <div className="flex items-start justify-between">
                <div>
                  <p
                    className="
                      font-[var(--font-inter)]
                      text-[10px]
                      uppercase
                      tracking-[0.35em]
                      text-white/45
                    "
                  >
                    {topLabel}
                  </p>

                  <div className="mt-4 h-px w-20 bg-cyan-300/40" />
                </div>

                <span
                  className="
                    rounded-full
                    border
                    border-white/15
                    bg-black/20
                    px-4
                    py-2
                    text-[10px]
                    uppercase
                    tracking-[0.25em]
                    text-white/45
                    backdrop-blur-md
                  "
                >
                  {explore}
                </span>
              </div>

              <div className="max-w-5xl">
                <p
                  className="
                    mb-5
                    font-[var(--font-inter)]
                    text-[11px]
                    uppercase
                    tracking-[0.4em]
                    text-cyan-300/70
                  "
                >
                  {eyebrow}
                </p>

                <h2
                  className="
                    font-[var(--font-syne)]
                    text-[clamp(3.5rem,10vw,9rem)]
                    font-medium
                    uppercase
                    leading-[0.82]
                    tracking-[-0.04em]
                    text-white
                  "
                >
                  {titleFirst}
                  <br />
                  {titleSecond}
                  <br />
                  <span className="text-white/35">
                    {titleThird}
                  </span>
                </h2>
              </div>

              <div
                className="
                  mt-12
                  flex
                  flex-col
                  gap-8
                  md:flex-row
                  md:items-end
                  md:justify-between
                "
              >
                <p
                  className="
                    max-w-md
                    font-[var(--font-inter)]
                    text-sm
                    leading-7
                    text-white/45
                    md:text-base
                  "
                >
                  {description}
                </p>

                <div
                  className="
                    flex
                    items-center
                    gap-4
                    self-start
                    md:self-auto
                  "
                >
                  <span
                    className="
                      text-[11px]
                      uppercase
                      tracking-[0.25em]
                      text-cyan-300/70
                      transition-colors
                      duration-300
                      group-hover:text-cyan-200
                    "
                  >
                    {enterVisuals}
                  </span>

                  <span
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-cyan-300/30
                      bg-cyan-300/10
                      text-lg
                      text-cyan-200
                      transition-all
                      duration-500
                      group-hover:translate-x-1
                      group-hover:border-cyan-300/60
                      group-hover:bg-cyan-300/15
                    "
                  >
                    →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>

        <div className="mt-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />

          <span
            className="
              font-[var(--font-inter)]
              text-[10px]
              uppercase
              tracking-[0.3em]
              text-white/20
            "
          >
            {bottomLabel}
          </span>

          <div className="h-px flex-1 bg-white/10" />
        </div>
      </div>
    </section>
  );
}