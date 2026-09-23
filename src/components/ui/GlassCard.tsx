export default function GlassCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
      relative
      rounded-3xl
      border
      border-white/10
      bg-white/[0.04]
      backdrop-blur-xl
      overflow-hidden
      shadow-[0_0_80px_rgba(34,211,238,0.12)]
      "
    >

      <div
        className="
        absolute
        inset-0
        bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_55%)]
        pointer-events-none
        "
      />

      <div className="relative">
        {children}
      </div>

    </div>
  );
}