"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const VISITOR_ID_KEY = "alien-chord-visitor-id";

function getVisitorId(): string {
  const existingId = localStorage.getItem(
    VISITOR_ID_KEY
  );

  if (existingId) {
    return existingId;
  }

  const newId =
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 12)}`;

  localStorage.setItem(
    VISITOR_ID_KEY,
    newId
  );

  return newId;
}

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    if (pathname.startsWith("/admin")) {
      return;
    }

    const visitorId = getVisitorId();

    fetch("/api/admin/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: pathname,
        visitorId,
      }),
    }).catch((error) => {
      console.error(
        "Analytics tracking error:",
        error
      );
    });
  }, [pathname]);

  return null;
}