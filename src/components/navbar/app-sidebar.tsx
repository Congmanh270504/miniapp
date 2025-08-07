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
  MessageCircleCode,
  Info,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "./team-switcher";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import NavUser from "./nav-user";

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
      name: "Reviews",
      url: "/reviews",
      icon: MessageCircleCode,
    },
    {
      name: "About",
      url: "/about",
      icon: Info,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { setTheme } = useTheme();
  const { state } = useSidebar();

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
        <div
          className={`flex items-center space-x-2 ${state ? "" : "ml-[7px]"}`}
        >
          {/* <Switch
            id="theme-mode"
            onClick={() => {
              isLight ? setTheme("dark") : setTheme("light");
              setIsLight(!isLight);
            }}
          /> */}
          {/* <Label
            htmlFor="theme-mode"
            className={`transition-opacity duration-200 ${
              state === "collapsed"
                ? "opacity-0 pointer-events-none"
                : "opacity-100"
            }`}
          >
            {isLight ? "Dark" : "Light"} Mode
          </Label> */}
        </div>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
