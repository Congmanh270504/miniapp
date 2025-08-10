"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export function Hero() {
  return (
    <div className="relative mx-auto max-w-3xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-3 flex items-center justify-center gap-2"
      >
        <Badge
          variant="secondary"
          className="border border-slate-200 bg-slate-100 text-slate-800"
        >
          <Sparkles className="mr-2 size-4" />
          Big update incoming
        </Badge>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="bg-gradient-to-b from-slate-900 to-slate-700 bg-clip-text text-4xl font-bold leading-tight text-transparent sm:text-5xl md:text-6xl"
      >
        A new era for music and community
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg"
      >
        I{"'"}m crafting features to help you connect, share, and grow: realtime
        chat, follow creators you love, a powerful dashboard, bigger uploads,
        and a faster experience throughout.
      </motion.p>
    </div>
  );
}
