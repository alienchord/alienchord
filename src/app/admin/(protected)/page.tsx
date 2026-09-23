import Link from "next/link";
import { getAdminReleases } from "@/lib/releases";

export default async function AdminPage() {
  const releases = await getAdminReleases();

  const releaseCount = releases.length;

  const latestReleases = [...releases]
    .sort((a, b) => {
      return (
        new Date(b.releaseDate).getTime() -
        new Date(a.releaseDate).getTime()
      );
    })
    .slice(0, 3);

  return (
    <section className="min-h-screen px-6 py-10 md:px-12 md:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="border-b border-white/10 pb-8">
          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.35em]
              text-cyan-300/60
            "
          >
            Alien Chord / Admin
          </p>

          <h1
            className="
              mt-4
              font-[var(--font-syne)]
              text-4xl
              uppercase
              tracking-[-0.03em]
              md:text-6xl
            "
          >
            Dashboard
          </h1>

          <p
            className="
              mt-4
              max-w-xl
              text-sm
              leading-7
              text-white/40
            "
          >
            Control the Alien Chord website, releases, media and
            platform settings from one place.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">
              Releases
            </span>

            <p className="mt-4 font-[var(--font-syne)] text-4xl">
              {String(releaseCount).padStart(2, "0")}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">
              Visuals
            </span>

            <p className="mt-4 font-[var(--font-syne)] text-4xl">
              03
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">
              Status
            </span>

            <p className="mt-4 font-[var(--font-syne)] text-2xl text-cyan-300">
              ONLINE
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 md:p-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">
                  Content
                </p>

                <h2 className="mt-2 font-[var(--font-syne)] text-2xl uppercase">
                  Latest Releases
                </h2>
              </div>

              <Link
                href="/admin/releases"
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.2em]
                  text-cyan-300/70
                  transition-colors
                  hover:text-cyan-300
                "
              >
                View all
              </Link>
            </div>

            <div className="mt-5 space-y-3">
              {latestReleases.length === 0 ? (
                <div className="py-8 text-sm text-white/30">
                  No releases yet.
                </div>
              ) : (
                latestReleases.map((release) => (
                  <Link
                    key={release.id}
                    href={`/admin/releases/${encodeURIComponent(
                      release.id
                    )}/edit`}
                    className="
                      flex
                      items-center
                      gap-4
                      rounded-xl
                      border
                      border-white/5
                      bg-white/[0.02]
                      p-3
                      transition-colors
                      hover:border-cyan-300/20
                      hover:bg-white/[0.04]
                    "
                  >
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white/5">
                      {release.cover ? (
                        <img
                          src={release.cover}
                          alt={release.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[9px] uppercase tracking-widest text-white/20">
                          No Cover
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-white">
                        {release.title}
                      </p>

                      <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/30">
                        {release.type} · {release.releaseDate}
                      </p>
                    </div>

                    <span className="text-white/20 transition-colors group-hover:text-cyan-300">
                      →
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 md:p-8">
            <div className="border-b border-white/10 pb-5">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">
                Quick Actions
              </p>

              <h2 className="mt-2 font-[var(--font-syne)] text-2xl uppercase">
                Control
              </h2>
            </div>

            <div className="mt-5 space-y-3">
              <Link
                href="/admin/releases/new"
                className="
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  border
                  border-cyan-300/20
                  bg-cyan-300/[0.06]
                  px-4
                  py-4
                  text-[11px]
                  uppercase
                  tracking-[0.18em]
                  text-cyan-300
                  transition-all
                  hover:border-cyan-300/40
                  hover:bg-cyan-300/[0.1]
                "
              >
                <span>Add Release</span>
                <span>+</span>
              </Link>

              <Link
                href="/admin/releases"
                className="
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.02]
                  px-4
                  py-4
                  text-[11px]
                  uppercase
                  tracking-[0.18em]
                  text-white/60
                  transition-all
                  hover:border-white/20
                  hover:text-white
                "
              >
                <span>Manage Releases</span>
                <span>→</span>
              </Link>

              <Link
                href="/admin/website"
                className="
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.02]
                  px-4
                  py-4
                  text-[11px]
                  uppercase
                  tracking-[0.18em]
                  text-white/60
                  transition-all
                  hover:border-white/20
                  hover:text-white
                "
              >
                <span>Website Settings</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
