export default function Hero() {
  return (
    <section
      className="
      min-h-screen
      flex
      items-center
      justify-center
      relative
      overflow-hidden
      "
    >

    <div className="hero-glow -z-0" />


      <div
  className="
  relative
  z-10
  -translate-y-8
        text-center
        flex
        flex-col
        items-center
        "
      >

        <h1
          className="
          font-[var(--font-syne)]
          text-6xl
          md:text-8xl
          font-semibold
          tracking-[0.22em]
          text-[#F4F7FF]
          drop-shadow-[0_0_25px_rgba(34,211,238,0.25)]
          "
        >
          ALIEN CHORD
        </h1>


        <p
          className="
          mt-3
          text-xs
          md:text-sm
          tracking-[0.35em]
          text-white/40
          font-[var(--font-inter)]
          uppercase
          "
        >
          ELECTRONIC ARTIST / PRODUCER
        </p>


        <a
          href="#latest-release"
          className="
          mt-10
          px-8
          py-3
          rounded-full
          border
          border-white/10
          bg-white/5
          backdrop-blur-md
          text-sm
          uppercase
          tracking-[0.25em]
          text-white/80
          transition-all
          duration-300
          hover:border-cyan-400/30
          hover:bg-cyan-400/10
          hover:text-white
          hover:shadow-[0_0_25px_rgba(34,211,238,0.18)]
          "
        >
          Listen Now
        </a>

      </div>

    </section>
  );
}