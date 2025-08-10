"use client";

import { useEffect, useMemo, useState } from "react";

export function AuroraBackground(
  { className = "" }: { className?: string } = { className: "" }
) {
  // Subtle movement for blobs
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((p) => (p + 1) % 360), 50);
    return () => clearInterval(id);
  }, []);

  const transform1 = useMemo(
    () =>
      `translate3d(${Math.sin(t / 40) * 10}px, ${Math.cos(t / 35) * 8}px, 0)`,
    [t]
  );
  const transform2 = useMemo(
    () =>
      `translate3d(${Math.cos(t / 45) * 12}px, ${Math.sin(t / 30) * 10}px, 0)`,
    [t]
  );
  const transform3 = useMemo(
    () =>
      `translate3d(${Math.sin(t / 35) * -8}px, ${Math.cos(t / 25) * -6}px, 0)`,
    [t]
  );

  return (
    <div
      aria-hidden="true"
      className={
        "pointer-events-none absolute inset-0 overflow-hidden [mask-image:radial-gradient(65%_55%_at_50%_35%,black,transparent)] " +
        className
      }
    >
      {/* Soft grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.06)_1px,transparent_1px)] bg-[length:28px_28px] opacity-40" />

      {/* Glow center */}
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 blur-3xl">
        <div className="size-[50rem] rounded-full bg-gradient-to-br from-fuchsia-400/15 via-violet-400/15 to-amber-300/15" />
      </div>

      {/* Floating blobs */}
      <div
        style={{ transform: transform1 }}
        className="absolute left-[10%] top-[20%] h-80 w-80 rounded-full bg-fuchsia-400/20 blur-3xl"
      />
      <div
        style={{ transform: transform2 }}
        className="absolute right-[15%] top-[15%] h-96 w-96 rounded-full bg-violet-400/20 blur-3xl"
      />
      <div
        style={{ transform: transform3 }}
        className="absolute bottom-[10%] left-1/3 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl"
      />
    </div>
  );
}
