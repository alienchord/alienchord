import Image from "next/image";
export default function LatestRelease() {
  return (
    <section
      id="latest-release"
      className="
      min-h-screen
      flex
      flex-col
      items-center
      justify-center
      px-6
      relative
      "
    >

      <div
        className="
        absolute
        w-[500px]
        h-[500px]
        bg-[radial-gradient(circle,_rgba(34,211,238,0.12),transparent_70%)]
        blur-[120px]
        "
      />


      <div
  className="
  relative
  z-10
  w-full
  text-center
  flex
  flex-col
  items-center
  "
>

        <h2
  className="
  font-[var(--font-syne)]
  text-3xl
  md:text-5xl
  tracking-[0.22em]
  whitespace-nowrap
  text-[#F4F7FF]
  "
>
  LATEST RELEASE
</h2>


        {/* Cover placeholder */}

        <div
  className="
  group
  relative
  overflow-hidden
  mt-14
  transition-transform
  duration-700
  hover:scale-[1.03]
  w-72
  h-72
  md:w-[360px]
  md:h-[360px]
  rounded-2xl
  border
  border-white/10
  hover:border-white/20
  "
>

<Image
  src="/cover.jpg"
  alt="Alien Chord release cover"
  fill
  className="
object-cover
rounded-2xl
"
/>
<div
  className="
  absolute
  inset-0
  rounded-2xl
  opacity-0
  group-hover:opacity-100
  transition-opacity
  duration-700
shadow-[0_0_90px_rgba(255,255,255,0.18),0_0_120px_rgba(34,211,238,0.22)]
  "
/>

</div>


        <h3
  className="
  mt-12
  text-2xl
  tracking-[0.3em]
  font-[var(--font-syne)]
  "
>
  NEVER COMING BACK
</h3>


        <p
          className="
          mt-3
          text-sm
          tracking-[0.35em]
          text-white/40
          uppercase
          "
        >
          OUT NOW
        </p>
        <p
  className="
  mt-6
  max-w-md
  text-sm
  leading-relaxed
  text-white/40
  font-[var(--font-inter)]
  "
>
  Composed with soul, close to my woman.
</p>


        {/* Platforms */}

        <div
          className="
          mt-10
          grid
          grid-cols-2
          gap-4
          "
        >

          {[
            "Spotify",
            "Apple Music",
            "YouTube",
            "Yandex Music",
          ].map((platform) => (
            <a
              key={platform}
              href="#"
              className="
              px-8
              py-3
              rounded-full
              border
              border-white/10
              bg-white/5
              backdrop-blur-md
              text-sm
              text-white/70
              transition
              hover:text-white
              hover:border-cyan-300/30
              hover:bg-cyan-400/10
              "
            >
              {platform}
            </a>
          ))}

        </div>

<p
  className="
  mt-12
  text-[10px]
  tracking-[0.4em]
  uppercase
  text-white/20
  font-[var(--font-inter)]
  "
>
  ALIEN CHORD © 2026
</p>

      </div>

    </section>
  );
}