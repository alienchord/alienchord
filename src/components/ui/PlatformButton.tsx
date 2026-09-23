export default function PlatformButton({
  name,
  href,
}: {
  name: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="
        rounded-full
        border
        border-white/10
        bg-white/[0.04]
        backdrop-blur-xl
        px-4
        py-2
        text-center
        text-[11px]
        tracking-[0.16em]
        uppercase
        text-white/70
        transition-all
        duration-300

        md:px-6
        md:py-3
        md:text-sm
        md:tracking-[0.2em]

        hover:text-white
        hover:border-cyan-300/40
        hover:bg-cyan-300/10
        hover:-translate-y-1
      "
    >
      {name}
    </a>
  );
}