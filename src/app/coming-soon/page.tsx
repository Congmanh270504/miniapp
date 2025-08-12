import type { Metadata } from "next";
import { Suspense } from "react";
import { AuroraBackground } from "@/components/comming-soon/aurora-background";
import { Hero } from "@/components/comming-soon/hero";
import { FeatureGrid } from "@/components/comming-soon/feature-grid";

export const metadata: Metadata = {
  title: "Coming Soon",
  description: "New features are on the way.",
};

export default function Page() {
  return (
    <div className="relative min-h-svh text-slate-900 dark:text-white">
      <AuroraBackground />

      <main className="relative z-10">
        <section className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 lg:px-8 lg:pt-16">
          <Suspense fallback={<div className="h-[40svh]" />}>
            <Hero />
          </Suspense>
        </section>

        <section
          aria-labelledby="features-heading"
          className="relative z-10 mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8"
        >
          <h2
            id="features-heading"
            className="mb-6 text-center text-sm font-medium uppercase tracking-wider text-slate-500"
          >
            {"What's coming"}
          </h2>
          <FeatureGrid />
        </section>
      </main>
    </div>
  );
}
