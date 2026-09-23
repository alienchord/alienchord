"use client";

import { useEffect, useMemo, useState } from "react";

type AnalyticsEvent = {
  id: string;
  visitorId: string;
  type: "pageview";
  path: string;
  timestamp: string;
  country: string;
};

type Period = 7 | 30 | 90;

type VisitorStats = {
  visitorId: string;
  views: number;
  lastVisit: string;
  country: string;
  pages: Set<string>;
};

export default function AnalyticsAdminPage() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [period, setPeriod] = useState<Period>(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const response = await fetch(
          "/api/admin/analytics",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load analytics."
          );
        }

        const data = await response.json();

        setEvents(
          Array.isArray(data?.events)
            ? data.events
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load analytics:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  const filteredEvents = useMemo(() => {
    const now = Date.now();
    const start =
      now - period * 24 * 60 * 60 * 1000;

    return events.filter((event) => {
      return (
        new Date(event.timestamp).getTime() >=
        start
      );
    });
  }, [events, period]);

  const totalViews = filteredEvents.length;

  const uniquePages = new Set(
    filteredEvents.map((event) => event.path)
  ).size;

  const visitorStats = useMemo(() => {
    const visitors = new Map<
      string,
      VisitorStats
    >();

    for (const event of filteredEvents) {
      const existing = visitors.get(
        event.visitorId
      );

      if (!existing) {
        visitors.set(event.visitorId, {
          visitorId: event.visitorId,
          views: 1,
          lastVisit: event.timestamp,
          country:
            event.country || "Unknown",
          pages: new Set([event.path]),
        });

        continue;
      }

      existing.views += 1;
      existing.pages.add(event.path);

      if (
        new Date(event.timestamp).getTime() >
        new Date(existing.lastVisit).getTime()
      ) {
        existing.lastVisit = event.timestamp;
        existing.country =
          event.country || "Unknown";
      }
    }

    return Array.from(visitors.values()).sort(
      (a, b) =>
        new Date(b.lastVisit).getTime() -
        new Date(a.lastVisit).getTime()
    );
  }, [filteredEvents]);

  const uniqueVisitors =
    visitorStats.length;

  const countryStats = useMemo(() => {
    const counts: Record<string, number> = {};

    for (const event of filteredEvents) {
      const country =
        event.country || "Unknown";

      counts[country] =
        (counts[country] || 0) + 1;
    }

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [filteredEvents]);

  const pageStats = useMemo(() => {
    const counts: Record<string, number> = {};

    for (const event of filteredEvents) {
      counts[event.path] =
        (counts[event.path] || 0) + 1;
    }

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [filteredEvents]);

  const dailyStats = useMemo(() => {
    const result: {
      date: string;
      views: number;
    }[] = [];

    for (
      let i = period - 1;
      i >= 0;
      i--
    ) {
      const date = new Date();

      date.setHours(0, 0, 0, 0);
      date.setDate(
        date.getDate() - i
      );

      const dateKey =
        date.toISOString().slice(0, 10);

      const views =
        filteredEvents.filter((event) => {
          return (
            event.timestamp.slice(0, 10) ===
            dateKey
          );
        }).length;

      result.push({
        date: dateKey,
        views,
      });
    }

    return result;
  }, [filteredEvents, period]);

  const maxViews = Math.max(
    ...dailyStats.map(
      (item) => item.views
    ),
    1
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#030308] px-6 py-10 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">
            Loading analytics...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#030308] px-4 py-8 text-white md:px-8 md:py-12">
      <div className="mx-auto max-w-6xl space-y-8">

        <header className="flex flex-col gap-5 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-cyan-300">
              Alien Chord
            </p>

            <h1 className="font-[var(--font-syne)] text-4xl uppercase tracking-[-0.03em] md:text-6xl">
              Analytics
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
              Website traffic and visitor statistics.
            </p>
          </div>

          <div className="flex gap-2">
            {[7, 30, 90].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  setPeriod(value as Period)
                }
                className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.16em] transition ${
                  period === value
                    ? "border-cyan-400/60 bg-cyan-400/10 text-cyan-300"
                    : "border-white/10 text-white/40 hover:border-white/20 hover:text-white"
                }`}
              >
                {value}D
              </button>
            ))}
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-4">

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">
              Page views
            </span>

            <p className="mt-4 font-[var(--font-syne)] text-4xl">
              {totalViews}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">
              Unique visitors
            </span>

            <p className="mt-4 font-[var(--font-syne)] text-4xl">
              {uniqueVisitors}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">
              Countries
            </span>

            <p className="mt-4 font-[var(--font-syne)] text-4xl">
              {
                countryStats.filter(
                  ([country]) =>
                    country !== "Unknown"
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">
              Period
            </span>

            <p className="mt-4 font-[var(--font-syne)] text-4xl text-cyan-300">
              {period}D
            </p>
          </div>

        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 md:p-6">
          <div className="mb-6">
            <h2 className="text-xs uppercase tracking-[0.2em] text-cyan-300">
              Visitors
            </h2>

            <p className="mt-2 text-xs text-white/30">
              One row per unique visitor.
            </p>
          </div>

          {visitorStats.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-8 text-center text-xs uppercase tracking-[0.16em] text-white/25">
              No visitors yet
            </div>
          ) : (
            <div className="space-y-2">
              {visitorStats
                .slice(0, 50)
                .map((visitor, index) => (
                  <div
                    key={visitor.visitorId}
                    className="rounded-xl border border-white/10 bg-black/20 px-4 py-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="flex min-w-0 items-center gap-4">
                        <span className="w-6 shrink-0 text-xs text-white/20">
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <div className="min-w-0">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-white/70">
                              {visitor.country}
                            </span>

                            <span className="text-[10px] uppercase tracking-[0.12em] text-cyan-300">
                              {visitor.views}{" "}
                              {visitor.views === 1
                                ? "view"
                                : "views"}
                            </span>
                          </div>

                          <p className="mt-1 truncate text-[10px] text-white/20">
                            {visitor.visitorId}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-5 text-[10px] text-white/30">
                        <span>
                          {visitor.pages.size}{" "}
                          {visitor.pages.size === 1
                            ? "page"
                            : "pages"}
                        </span>

                        <span>
                          {new Date(
                            visitor.lastVisit
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 md:p-6">
          <div className="mb-6">
            <h2 className="text-xs uppercase tracking-[0.2em] text-cyan-300">
              Countries
            </h2>

            <p className="mt-2 text-xs text-white/30">
              Visitor locations during the selected period.
            </p>
          </div>

          {countryStats.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-8 text-center text-xs uppercase tracking-[0.16em] text-white/25">
              No data yet
            </div>
          ) : (
            <div className="space-y-3">
              {countryStats.map(
                ([country, views]) => {
                  const width = Math.max(
                    (views / totalViews) * 100,
                    4
                  );

                  return (
                    <div
                      key={country}
                      className="rounded-xl border border-white/10 bg-black/20 p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-white/70">
                          {country}
                        </span>

                        <span className="shrink-0 text-xs text-cyan-300">
                          {views}
                        </span>
                      </div>

                      <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-cyan-300/60"
                          style={{
                            width: `${width}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 md:p-6">
          <div className="mb-8">
            <h2 className="text-xs uppercase tracking-[0.2em] text-cyan-300">
              Traffic
            </h2>

            <p className="mt-2 text-xs text-white/30">
              Page views per day
            </p>
          </div>

          <div className="flex h-64 items-end gap-1 border-b border-white/10">
            {dailyStats.map((item) => {
              const height =
                item.views === 0
                  ? 2
                  : Math.max(
                      (item.views / maxViews) *
                        100,
                      4
                    );

              return (
                <div
                  key={item.date}
                  className="group relative flex h-full flex-1 items-end"
                >
                  <div
                    className="w-full rounded-t-sm bg-cyan-300/70 transition hover:bg-cyan-300"
                    style={{
                      height: `${height}%`,
                    }}
                  />

                  <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-[#101014] px-2 py-1 text-[10px] text-white/70 group-hover:block">
                    {item.views} views
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex justify-between text-[9px] uppercase tracking-[0.12em] text-white/20">
            <span>
              {dailyStats[0]?.date || ""}
            </span>

            <span>
              {dailyStats[
                dailyStats.length - 1
              ]?.date || ""}
            </span>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 md:p-6">
          <div className="mb-6">
            <h2 className="text-xs uppercase tracking-[0.2em] text-cyan-300">
              Top Pages
            </h2>

            <p className="mt-2 text-xs text-white/30">
              Most visited pages during the selected period.
            </p>
          </div>

          {pageStats.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-8 text-center text-xs uppercase tracking-[0.16em] text-white/25">
              No data yet
            </div>
          ) : (
            <div className="space-y-3">
              {pageStats.map(
                ([page, views]) => {
                  const width = Math.max(
                    (views / totalViews) * 100,
                    4
                  );

                  return (
                    <div
                      key={page}
                      className="rounded-xl border border-white/10 bg-black/20 p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="truncate text-sm text-white/70">
                          {page}
                        </span>

                        <span className="shrink-0 text-xs text-cyan-300">
                          {views}
                        </span>
                      </div>

                      <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-cyan-300/60"
                          style={{
                            width: `${width}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}