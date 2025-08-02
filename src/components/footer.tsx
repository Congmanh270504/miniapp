import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin } from "lucide-react";
import { SocialLinks } from "@/components/custom/social-links";
import { NewsletterSignup } from "@/components/custom/newsletter-signup";
import VN from "country-flag-icons/react/3x2/VN";

const footerData = {
  sections: [
    {
      title: "Music Library",
      links: [
        { name: "All Songs", href: "/songs" },
        { name: "Favorites", href: "/songs/favorites" },
      ],
    },
    {
      title: "Account",
      links: [
        { name: "Profile Settings", href: "/user-profile" },
        { name: "Subscription", href: "/#" },
      ],
    },
    {
      title: "Features",
      links: [
        { name: "Upload Your Music", href: "/songs/create" },
        { name: "Music Discovery", href: "/songs/all" },
        { name: "Artist Dashboard", href: "/you/tracks" },
        { name: "Planned Features", href: "/planned-features" },
      ],
    },
    {
      title: "Community",
      links: [
        { name: "About", href: "/about" },
        { name: "Blog", href: "/#" },
      ],
    },
    {
      title: "Support & Company",
      links: [
        { name: "Help Center", href: "/#" },
        { name: "Contact Support", href: "/support" },
      ],
      subSections: [
        {
          title: "Legal",
          links: [
            { name: "Terms of Service", href: "/terms" },
            { name: "Privacy Policy", href: "/privacy" },
          ],
        },
      ],
    },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Contact Information - Left Side */}
            <div className="col-span-1">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Contact Me
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-green-600" />
                  <Link
                    href="tel:+1234567890"
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    +1 (234) 567-8900
                  </Link>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-red-500" />
                  <Link
                    href="mailto:contact@company.com"
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    trancongmanh270504@gmail.com
                  </Link>
                </li>
                <li className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-600">
                    Somewhere on Earth :)
                  </span>
                </li>
              </ul>

              {/* Social Media */}
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  Follow Us
                </h3>
                <SocialLinks />
              </div>
            </div>

            {/* Main Footer Links - Right Side */}
            <div className="col-span-1 lg:col-span-3">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {footerData.sections.map((section, index) => (
                  <div key={index} className="col-span-1">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">
                      {section.title}
                    </h3>
                    {section.links && (
                      <ul className="space-y-3">
                        {section.links.map((link, linkIndex) => (
                          <li key={linkIndex}>
                            <Link
                              href={link.href}
                              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                            >
                              {link.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.subSections &&
                      section.subSections.map((subSection, subIndex) => (
                        <div
                          key={subIndex}
                          className={subIndex > 0 ? "mt-8" : "mt-8"}
                        >
                          <h3 className="text-sm font-medium text-gray-900 mb-4">
                            {subSection.title}
                          </h3>
                          <ul className="space-y-3">
                            {subSection.links.map((link, linkIndex) => (
                              <li key={linkIndex}>
                                <Link
                                  href={link.href}
                                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                  {link.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-200" />

        {/* Bottom Section */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <p className="text-sm text-gray-500">
                Copyright © {new Date().getFullYear()} Cong Manh's MusicApp .
                All rights reserved.
              </p>
              <div className="flex flex-wrap items-center space-x-4">
                <Link
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Privacy Policy
                </Link>
                <span className="text-sm text-gray-300">|</span>
                <Link
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Terms of Use
                </Link>
                <span className="text-sm text-gray-300">|</span>
                <Link
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Sales and Refunds
                </Link>
                <span className="text-sm text-gray-300">|</span>
                <Link
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Legal
                </Link>
                <span className="text-sm text-gray-300">|</span>
              </div>
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              Việt Nam | <VN className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
