export default function Navbar() {
  return (
    <nav
      className="
      fixed
      top-0
      left-0
      w-full
      z-50
      px-10
      py-6
      bg-black/20
backdrop-blur-md
border-b
border-white/10
shadow-[0_10px_40px_rgba(0,0,0,0.35)]
      "
    >

      <div className="flex items-center justify-between">

        <div
          className="
          font-[var(--font-syne)]
          text-lg
          font-medium
          tracking-[0.22em]
          text-white/80
          "
        >
          ALIEN CHORD
        </div>


        <div
          className="
          flex
          gap-8
          text-sm
          font-[var(--font-inter)]
          tracking-wide
          text-white/60
          "
        >

          <a
            href="#latest-release"
            className="
            transition
            hover:text-cyan-300
            "
          >
            Music
          </a>


          <a
            href="#about"
            className="
            transition
            hover:text-cyan-300
            "
          >
            About
          </a>


          <a
            href="#contact"
            className="
            transition
            hover:text-cyan-300
            "
          >
            Contact
          </a>

        </div>

      </div>

    </nav>
  );
}