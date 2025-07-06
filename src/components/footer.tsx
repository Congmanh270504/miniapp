import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin } from "lucide-react";
import { SocialLinks } from "@/components/custom/social-links";
import { NewsletterSignup } from "@/components/custom/newsletter-signup";

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
      title: "Features",
      links: [
        { name: "Upload Music", href: "/songs/upload" },
        { name: "Create Playlist", href: "/playlists/create" },
      ],
    },
    {
      title: "Account",
      links: [
        { name: "Profile Settings", href: "/profile" },
        { name: "Subscription", href: "/subscription" },
      ],
    },
    {
      title: "Discover",
      links: [
        { name: "Trending Now", href: "/trending" },
        { name: "New Releases", href: "/new-releases" },
      ],
    },
    {
      title: "Community",
      subSections: [
        {
          title: "For Artists",
          links: [
            { name: "Upload Your Music", href: "/artists/upload" },
            { name: "Artist Dashboard", href: "/artists/dashboard" },
          ],
        },
        {
          title: "For Listeners",
          links: [
            { name: "Music Discovery", href: "/discover" },
            { name: "Social Features", href: "/social" },
          ],
        },
      ],
    },
    {
      title: "Support & Company",
      links: [
        { name: "Help Center", href: "/help" },
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
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

            <div className="col-span-2 md:col-span-3 lg:col-span-6">
              <Separator className="bg-gray-200 my-8" />
            </div>

            {/* Contact Information */}
            <div className="col-span-2 md:col-span-3 lg:col-span-6 mt-8 lg:mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contact Details */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">
                    Contact Us
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
                        contact@company.com
                      </Link>
                    </li>
                    <li className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-600">
                        123 Innovation Drive, Tech City, TC 12345
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Social Media */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">
                    Follow Us
                  </h3>
                  <SocialLinks />

                  <NewsletterSignup />
                </div>
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
                Copyright © {new Date().getFullYear()} MusicApp Inc. All rights
                reserved.
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
                <Link
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Site Map
                </Link>
              </div>
            </div>
            <div className="text-sm text-gray-500">United States</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
