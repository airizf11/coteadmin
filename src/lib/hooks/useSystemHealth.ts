// coteadmin/src/lib/hooks/useSystemHealth.ts
"use client";

import { useEffect, useState } from "react";

export function useSystemHealth(intervalMs = 20000) {
  const [health, setHealth] = useState<{
    internet: boolean;
    api: "ok" | "down";
    db: "ok" | "down" | "unknown";
    lastChecked: Date | null;
  }>({ internet: true, api: "ok", db: "ok", lastChecked: null });

  useEffect(() => {
    let cancelled = false;

    async function checkHealth() {
      const internet =
        typeof navigator !== "undefined" ? navigator.onLine : true;
      if (!internet) {
        if (!cancelled)
          setHealth({
            internet: false,
            api: "down",
            db: "unknown",
            lastChecked: new Date(),
          });
        return;
      }
      try {
        const res = await fetch("/api/health", { cache: "no-store" });
        const data = await res.json();
        if (!cancelled) {
          setHealth({
            internet: true,
            api: res.ok ? "ok" : "down",
            db: data.db === "ok" ? "ok" : "down",
            lastChecked: new Date(),
          });
        }
      } catch {
        if (!cancelled)
          setHealth({
            internet: true,
            api: "down",
            db: "unknown",
            lastChecked: new Date(),
          });
      }
    }

    checkHealth();
    const interval = setInterval(checkHealth, intervalMs);
    window.addEventListener("offline", checkHealth);
    window.addEventListener("online", checkHealth);
    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener("offline", checkHealth);
      window.removeEventListener("online", checkHealth);
    };
  }, [intervalMs]);

  const status: "ok" | "degraded" | "down" =
    !health.internet || health.api === "down"
      ? "down"
      : health.db === "down"
        ? "degraded"
        : "ok";

  return { ...health, status };
}
