export default function About() {
  return (
    <section
      id="about"
      className="
      min-h-screen
      flex
      items-center
      justify-center
      px-6
      relative
      "
    >

      <div
        className="
        max-w-3xl
        text-center
        "
      >

        <h2
          className="
          font-[var(--font-syne)]
          text-4xl
          md:text-5xl
          tracking-[0.25em]
          text-[#F4F7FF]
          "
        >
          ABOUT
        </h2>


        <p
          className="
          mt-10
          text-white/50
          leading-relaxed
          text-base
          md:text-lg
          font-[var(--font-inter)]
          "
        >
          Alien Chord is an electronic artist and producer
          creating futuristic soundscapes where emotion,
          energy and atmosphere meet.
        </p>


        <p
          className="
          mt-6
          text-white/40
          leading-relaxed
          text-base
          md:text-lg
          font-[var(--font-inter)]
          "
        >
          Blending electronic influences with modern
          production, every track is built as a journey
          through sound and visual imagination.
        </p>


      </div>

    </section>
  );
}