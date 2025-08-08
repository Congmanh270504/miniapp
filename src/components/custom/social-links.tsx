import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Facebook, Github, Instagram, Mail } from "lucide-react";

interface SocialLink {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  hoverColor: string;
  iconColor: string;
}

const socialLinks: SocialLink[] = [
  {
    href: "https://www.facebook.com/tran.cong.manh.388739",
    icon: Facebook,
    label: "Follow us on Facebook",
    hoverColor: "hover:border-blue-600",
    iconColor: "text-blue-600",
  },
  {
    href: "https://github.com/Congmanh270504",
    icon: Github,
    label: "Follow us on GitHub",
    hoverColor: "hover:border-gray-800",
    iconColor: "text-gray-800",
  },
  {
    href: "https://www.instagram.com/congmanh270504",
    icon: Instagram,
    label: "Follow us on Instagram",
    hoverColor: "hover:border-pink-500",
    iconColor: "text-pink-500",
  },
  {
    href: "mailto:trancongmanh270504@gmail.com?subject=Hello&body=Hi there!",
    icon: Mail,
    label: "Send us an email",
    hoverColor: "hover:border-red-500",
    iconColor: "text-red-500",
  },
];

export const SocialLinks: React.FC = () => {
  return (
    <div className="flex space-x-4">
      {socialLinks.map((social, index) => {
        const IconComponent = social.icon;

        return (
          <Button
            key={index}
            variant="outline"
            size="icon"
            asChild
            className={`bg-white border border-gray-200 ${social.hoverColor} hover:shadow-md transition-all duration-200 group`}
          >
            <Link href={social.href} aria-label={social.label}>
              <IconComponent
                className={`h-5 w-5 ${social.iconColor} group-hover:scale-110 transition-transform`}
              />
            </Link>
          </Button>
        );
      })}
    </div>
  );
};
