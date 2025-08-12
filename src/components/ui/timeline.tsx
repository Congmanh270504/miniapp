"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { Upload, Settings, UserPlus, MessageCircle } from "lucide-react";
import ShinyText from "./react-bits/text-animations/ShinyText/ShinyText";

const experiences = [
  {
    title: "Upload your music files",
    company: "Music Library",
    description:
      "Share your music with the world! Upload your audio files in various formats (MP3, WAV, FLAC) and let others discover your tracks. Our platform supports high-quality audio streaming.",
    icon: Upload,
    iconColor: "text-purple-600",
    dotColor: "bg-purple-500",
  },
  {
    title: "Manage your music files",
    company: "Music Dashboard",
    description:
      "Organize your music collection with powerful management tools. Create songs pretty simple, edit track information",
    icon: Settings,
    iconColor: "text-pink-600",
    dotColor: "bg-pink-500",
  },
  {
    title: "Create & connect your account",
    company: "User Security",
    description:
      "Sign up and connect your personal account to unlock all features. Secure authentication powered by Clerk ensures your data is protected with enterprise-grade security and privacy.",
    icon: UserPlus,
    iconColor: "text-purple-600",
    dotColor: "bg-purple-500",
  },
  {
    title: "Comment on songs you like",
    company: "Music Community",
    description:
      "Engage with the music community! Leave comments on songs, share your thoughts about tracks, and connect with other music lovers who share your musical taste.",
    icon: MessageCircle,
    iconColor: "text-pink-600",
    dotColor: "bg-pink-500",
  },
];

export function Timeline() {
  const isMobile = useIsMobile();

  return (
    <div
      className={`space-y-12 relative ${
        !isMobile
          ? "before:absolute before:inset-0 before:left-1/2 before:ml-0 before:-translate-x-px before:w-0.5 before:bg-gradient-to-b before:from-purple-400 before:to-pink-400 before:h-full before:z-0"
          : ""
      }`}
    >
      {experiences.map((experience, index) => (
        <motion.div
          key={index}
          className={`relative z-10 flex items-center ${
            index % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"
          }`}
          initial={{
            opacity: 0,
            x: index % 2 === 0 ? 100 : -100,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.6,
            delay: index * 0.2,
            ease: "easeOut",
          }}
          viewport={{
            once: true,
            margin: "-100px",
          }}
        >
          <div
            className={`${
              index % 2 === 0 ? "md:pl-10" : "md:pr-10"
            } w-full md:w-1/2`}
          >
            <motion.div
              className="relative overflow-hidden rounded-xl bg-white/20 backdrop-blur-lg border border-white/30 p-6 shadow-xl transition-all duration-300"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: index * 0.2 + 0.2,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <motion.div
                  className="flex items-center gap-3 mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.2 + 0.4,
                  }}
                  viewport={{ once: true }}
                >
                  <experience.icon
                    className={`w-6 h-6 ${experience.iconColor}`}
                  />
                  <ShinyText
                    text={experience.title}
                    disabled={false}
                    speed={3}
                    className="text-xl font-bold text-gray-800 dark:text-gray-200"
                  />
                </motion.div>
                <motion.div
                  className="text-gray-600 mb-4 text-sm dark:text-gray-400"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.2 + 0.5,
                  }}
                  viewport={{ once: true }}
                >
                  {experience.company}
                </motion.div>
                <motion.p
                  className="text-gray-700 dark:text-gray-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.2 + 0.6,
                  }}
                  viewport={{ once: true }}
                >
                  {experience.description}
                </motion.p>
              </div>
            </motion.div>
          </div>
          {!isMobile && (
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
              <motion.div
                className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 z-10 flex items-center justify-center"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </motion.div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
