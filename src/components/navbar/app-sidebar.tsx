"use client";
import { useTheme } from "next-themes";
import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Music,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "./team-switcher";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import NavUser from "./nav-user";
import { Suspense } from "react";

// This is sample data.
const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Songs",
      url: "/songs",
      icon: Music,
      isActive: true,
      items: [
        {
          title: "All Songs",
          url: "/songs",
        },
        {
          title: "Favorites",
          url: "/songs/heartSongs",
        },
        {
          title: "Upload Music",
          url: "/songs/create",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { setTheme } = useTheme();

  const [isLight, setIsLight] = React.useState(true);
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center space-x-2 ml-[7px]">
          <Switch
            id="theme-mode"
            onClick={() => {
              isLight ? setTheme("dark") : setTheme("light");
              setIsLight(!isLight);
            }}
          />
          <Label htmlFor="theme-mode">{isLight ? "Dark" : "Light"} Mode</Label>
        </div>
        <Suspense
          fallback={
            <div className="h-8 w-8 rounded-lg bg-gray-200 animate-pulse" />
          }
        >
          <NavUser />
        </Suspense>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
