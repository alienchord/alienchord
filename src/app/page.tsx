import Link from "next/link";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LatestRelease from "@/components/LatestRelease";
import { VisualsPreview } from "@/components/VisualsPreview";
import About from "@/components/About";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <Hero />

      <LatestRelease />

      <VisualsPreview />

      <About />

      <Contact />

      <Link
        href="/admin/login?google=1"
        aria-label="Admin"
        className="
          fixed
          bottom-5
          right-5
          z-50
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-full
          border
          border-white/10
          bg-black/40
          text-white/25
          backdrop-blur-md
          transition-all
          duration-300
          hover:border-cyan-400/40
          hover:bg-cyan-400/10
          hover:text-cyan-300
          hover:shadow-[0_0_20px_rgba(0,245,255,0.15)]
        "
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect
            x="4"
            y="4"
            width="16"
            height="16"
            rx="3"
            stroke="currentColor"
            strokeWidth="1.5"
          />

          <path
            d="M8 8H16M8 12H16M8 16H13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </Link>
    </main>
  );
}