"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Code2,
  Palette,
  Database,
  Shield,
  Cloud,
  Play,
  Zap,
  ArrowRight,
  Star,
  Users,
  Rocket,
  DollarSign,
} from "lucide-react";
import Frameworks from "@/components/ui/fameworks";
import RotatingText from "@/components/ui/react-bits/text-animations/RotatingText/RotatingText";
import Image from "next/image";
import Link from "next/link";
import { SocialLinks } from "@/components/custom/social-links";
import Limit from "@/components/ui/limit";

const features = [
  {
    icon: Rocket,
    title: "Lightning Fast",
    description:
      "Learned how to build with Next.js for optimal performance and SEO",
    delay: "0ms",
  },
  {
    icon: Shield,
    title: "Secure Authentication",
    description: "Apply framework Clerk for enterprise-grade security",
    delay: "200ms",
  },
  {
    icon: Cloud,
    title: "Decentralized Storage",
    description: "IPFS integration with Pinata for reliable file storage",
    delay: "400ms",
  },
  {
    icon: Users,
    title: "User-Friendly",
    description: "Intuitive interface designed for the best user experience",
    delay: "600ms",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto text-center relative z-10">
          <div
            className={
              "transition-all duration-1000 transform translate-y-0 opacity-100"
            }
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Welcome to Lauren
            </h1>
            <div className="text-2xl md:text-4xl font-semibold mb-8 h-12 flex items-center justify-center">
              <span>Building </span>
              <RotatingText
                texts={["Innovative", "Modern", "Scalable", "Powerful"]}
                mainClassName="px-2 sm:px-2 md:px-3 text-[#320A6B] overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                staggerFrom={"last"}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2500}
              />
              <span> Solutions</span>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Crafting cutting-edge web applications with modern technologies
              and innovative approaches
            </p>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-500/10 rounded-full animate-bounce delay-2000"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-500/10 rounded-full animate-bounce delay-3000"></div>
      </section>

      {/* Project Introduction */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div
            className={
              "transition-all duration-1000 delay-500 transform translate-y-0 opacity-100"
            }
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 text-[#320A6B]">
                About This Project
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-purple-500 mx-auto mb-8"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-3xl font-semibold">
                  Revolutionizing Web Development
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  This project represents the pinnacle of modern web
                  development, combining the latest technologies to create
                  seamless, scalable, and secure applications. Built with a
                  focus on performance, user experience, and developer
                  productivity.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  From authentication to file storage, from responsive design to
                  real-time features, every aspect has been carefully crafted to
                  deliver exceptional results.
                </p>
                <span className="flex items-center justify-center gap-2 group">
                  <ArrowRight className="ml-2 h-12 w-12 group-hover:translate-x-1 transition-transform" />
                  <p className="text-lg  text-muted-foreground leading-relaxed">
                    This project may still contain some mistakes in logic,
                    performance, or UI/UX layout. If anything bothers you,
                    please feel free to contact me. I truly appreciate you
                    taking the time to try and use my project ❤️.
                  </p>
                </span>
                <div className="flex justify-between mt-8 max-w-sm ">
                  <Button size="lg" className="group w-fit">
                    Explore Features
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <SocialLinks />
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
                <Card className="relative bg-background/80 backdrop-blur-sm border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      Key Highlights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Full-stack TypeScript application</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-200"></div>
                      <span>Server-side rendering with Next.js</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-400"></div>
                      <span>Secure authentication system</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse delay-600"></div>
                      <span>Decentralized file storage</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30 mt-[12em]">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-[#320A6B]">
              Why I built this web app?
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              I built this project to enhance my coding skills and explore how
              music streaming platforms like Spotify, SoundCloud, and YouTube
              work behind the scenes. More importantly, I wanted to create a
              space where everybody can share their music and connect with
              others.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card
                  key={index}
                  className={`group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-2 hover:border-primary/30 animate-fade-in-up`}
                  style={{ animationDelay: feature.delay }}
                >
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      {/* Tech Stack Section */}
      <div className="p-4">
        <Frameworks />
      </div>
      {/* Limit Section */}
      {/* Limitations & Pricing Section */}
      <section className="py-20 px-4 bg-muted/30 mt-[12em]">
        <Limit />
      </section>
      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10">
        <div className="container mx-auto text-center">
          <div
            className={
              "transition-all duration-1000 delay-1000 transform translate-y-0 opacity-100"
            }
          >
            <h2 className="text-4xl font-bold mb-6 text-[#320A6B]">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience the power of modern web development with this
              comprehensive tech stack
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/songs/create">
                <Button size="lg" className="group cursor-pointer">
                  View Live Demo
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="group bg-transparent"
                disabled={true}
              >
                <Code2 className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                View Source Code
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
