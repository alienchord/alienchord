export default function Contact() {
  return (
    <section
      id="contact"
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
          CONTACT
        </h2>


        <p
          className="
          mt-8
          text-white/40
          font-[var(--font-inter)]
          "
        >
          For bookings, collaborations and inquiries
        </p>


        <a
          href="mailto:contact@alienchord.com"
          className="
          inline-block
          mt-8
          px-8
          py-3
          rounded-full
          border
          border-white/10
          bg-white/5
          backdrop-blur-md
          text-sm
          tracking-[0.25em]
          uppercase
          text-white/70
          transition-all
          duration-300
          hover:text-white
          hover:border-cyan-300/30
          hover:bg-cyan-400/10
          hover:shadow-[0_0_30px_rgba(34,211,238,0.18)]
          "
        >
          Email
        </a>


        <div
          className="
          mt-12
          flex
          justify-center
          gap-8
          text-sm
          tracking-[0.2em]
          text-white/40
          uppercase
          "
        >

          <a
            href="#"
            className="hover:text-cyan-300 transition"
          >
            Instagram
          </a>


          <a
            href="#"
            className="hover:text-cyan-300 transition"
          >
            Spotify
          </a>


          <a
            href="#"
            className="hover:text-cyan-300 transition"
          >
            YouTube
          </a>

        </div>


      </div>

    </section>
  );
}