"use client";

import type React from "react";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  UserPlus,
  LayoutDashboard,
  HardDrive,
  Rocket,
  BellRing,
  Smartphone,
} from "lucide-react";

type Feature = {
  title: string;
  description: string;
  status: "In Progress" | "Planned" | "Researching";
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  accentClass: string;
};

const features: Feature[] = [
  {
    title: "Realtime Chat",
    description:
      "Instant messages with typing indicators, read receipts, and low-latency delivery.",
    status: "In Progress",
    icon: MessageSquare,
    accentClass: "from-fuchsia-500 to-rose-400",
  },
  {
    title: "Notifications",
    description:
      "In-app toasts and optional browser alerts for follows, messages, and uploads.",
    status: "In Progress",
    icon: BellRing,
    accentClass: "from-emerald-500 to-teal-400",
  },
  {
    title: "Follow Creators",
    description:
      "Follow users you like to keep up with releases, playlists, and updates.",
    status: "Planned",
    icon: UserPlus,
    accentClass: "from-amber-400 to-orange-500",
  },
  {
    title: "User Dashboard",
    description:
      "A central place to manage uploads, insights, stats, and account settings.",
    status: "Planned",
    icon: LayoutDashboard,
    accentClass: "from-violet-500 to-fuchsia-500",
  },
  {
    title: "Mobile-first UI/UX",
    description:
      "Responsive, touch-friendly design optimized for smartphones with smooth gestures and accessible.",
    status: "Planned",
    icon: Smartphone,
    accentClass: "from-rose-500 to-violet-500",
  },
  {
    title: "Performance Boost",
    description:
      "Optimized streaming, faster load times, and smoother navigation across the app.",
    status: "Researching",
    icon: Rocket,
    accentClass: "from-pink-500 to-amber-400",
  },
];

function StatusBadge({ status }: { status: Feature["status"] }) {
  const map: Record<Feature["status"], string> = {
    "In Progress": "bg-amber-100 text-amber-800 border border-amber-200",
    Planned: "bg-slate-100 text-slate-700 border border-slate-200",
    Researching: "bg-fuchsia-100 text-fuchsia-800 border border-fuchsia-200",
  };
  return (
    <Badge variant="secondary" className={map[status]}>
      {status}
    </Badge>
  );
}

export function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((f, i) => (
        <motion.div
          key={f.title}
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45, delay: i * 0.05, ease: "easeOut" }}
        >
          <Card className="group relative overflow-hidden border-slate-200 bg-white shadow-sm">
            {/* Accent highlight on hover */}
            <div
              className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(60% 60% at 50% 0%, rgba(2,6,23,0.06), transparent 70%)",
              }}
              aria-hidden="true"
            />
            {/* Top gradient bar */}
            <div
              className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${f.accentClass} opacity-80`}
            />
            <CardHeader className="relative">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-10 items-center justify-center rounded-lg bg-gradient-to-br ${f.accentClass} text-white shadow-lg shadow-black/10 transition-transform duration-300 group-hover:scale-105`}
                    aria-hidden="true"
                  >
                    <f.icon className="size-5" />
                  </div>
                  <CardTitle className="text-base text-slate-900 sm:text-lg">
                    {f.title}
                  </CardTitle>
                </div>
                <StatusBadge status={f.status} />
              </div>
            </CardHeader>
            <CardContent className="pb-5">
              <p className="text-sm text-slate-600">{f.description}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
