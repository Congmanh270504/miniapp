import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Code2,
  Palette,
  Database,
  Shield,
  Cloud,
  Play,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

import SplitText from "./react-bits/text-animations/SplitText/SplitText";
import { RiNextjsFill } from "react-icons/ri";
import { RiTailwindCssFill } from "react-icons/ri";
import { SiClerk, SiMongodb } from "react-icons/si";
import { GiPinata } from "react-icons/gi";
import { SiLucide } from "react-icons/si";
import { BiLogoTypescript } from "react-icons/bi";
import { SiZod } from "react-icons/si";
const frameworks = [
  {
    name: "Next.js",
    description:
      "React framework for production with server-side rendering and static site generation",
    icon: RiNextjsFill,
    color: "text-black dark:text-white",
  },
  {
    name: "TypeScript",
    description:
      "Typed superset of JavaScript that compiles to plain JavaScript for better development",
    icon: BiLogoTypescript,
    color: "text-blue-600",
  },
  {
    name: "Tailwind CSS",
    description:
      "Utility-first CSS framework for rapidly building custom user interfaces",
    icon: RiTailwindCssFill,
    color: "text-cyan-500",
  },
  {
    name: "MongoDB",
    description:
      "NoSQL document database for modern applications with flexible schema",
    icon: SiMongodb,
    color: "text-green-600",
  },
  {
    name: "Clerk",
    description:
      "Complete authentication and user management solution for modern applications",
    icon: SiClerk,
    color: "text-purple-600",
  },
  {
    name: "React Hook Form & Zod",
    description:
      "Performant, flexible and extensible forms with easy-to-use validation TypeScript-first schema declaration and validation library for data validation",
    icon: SiZod,
    color: "text-blue-400",
  },
  {
    name: "Pinata Cloud",
    description:
      "IPFS pinning service for decentralized file storage and content delivery",
    icon: GiPinata,
    color: "text-pink-500",
  },
  {
    name: "React Player",
    description:
      "React component for playing various media formats including YouTube and Vimeo",
    icon: Play,
    color: "text-red-500",
  },
  {
    name: "Lucide Icons",
    description:
      "Beautiful and consistent icon library with over 1000+ SVG icons",
    icon: SiLucide,
    color: "text-orange-500",
  },
  {
    name: "Framer Motion",
    description:
      "Production-ready motion library for React to create animations and transitions",
    icon: Zap,
    color: "text-yellow-500",
  },
];

export default function Frameworks() {
  return (
    <section className="py-12 relative w-full overflow-hidden text-center mb-10 mt-[15em]">
      <div className="space-y-4">
        <div className="inline-block mb-2">
          <div className="relative px-3 py-1 text-sm font-medium rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
            <span className="relative z-10">
              <SplitText
                text={"Frameworks"}
                className="text-6xl italic text-center text-[#670D2F] px-3"
                delay={100}
                duration={0.6}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
              />
            </span>
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse shadow-lg hover:shadow-xl"></span>
          </div>
        </div>

        <div className="w-24 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mt-6 "></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-16">
        {frameworks.map((framework, index) => {
          const IconComponent = framework.icon;
          return (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20"
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                  <IconComponent
                    className={`h-8 w-8 ${framework.color} group-hover:scale-110 transition-transform`}
                  />
                </div>
                <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {framework.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm text-center leading-relaxed">
                  {framework.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm text-muted-foreground">
          <Zap className="h-4 w-4" />
          <span>Powered by modern web technologies</span>
        </div>
      </div>
    </section>
  );
}
