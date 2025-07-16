import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SocialLinks } from "@/components/custom/social-links";
import { SectionHeading } from "@/components/ui/section-heading";
import { Timeline } from "@/components/ui/timeline";
import { prisma } from "@/utils/prisma";
import { ProcessedSongsData } from "../../types/song-types";
import { TrendingSongs } from "@/components/custom/trending-songs";
import { StepperWrapper } from "@/components/custom/stepper-wrapper";
import TiltedCard from "@/components/ui/react-bits/react-bit-component/TiltedCard/TiltedCard";
import RotatingText from "@/components/ui/react-bits/text-animations/RotatingText/RotatingText";
import { unstable_cache } from "next/cache";
import { songForListFast } from "@/lib/prisma-includes";
import {
  createBatchAccessLinks,
  transformSongDataFull,
} from "@/lib/song-utils";
import { Metadata } from "next";
import { Suspense } from "react";

// Metadata for SEO optimization
export const metadata: Metadata = {
  title: "Music Library - Discover & Share Your Favorite Music",
  description:
    "Discover new tracks, create personalized playlists, and connect with fellow music lovers in one beautiful platform",
  keywords: [
    "music",
    "songs",
    "playlist",
    "audio",
    "streaming",
    "discover",
    "trending",
  ],
  openGraph: {
    title: "Music Library - Discover & Share Your Favorite Music",
    description:
      "Discover new tracks, create personalized playlists, and connect with fellow music lovers",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Cached function để lấy trending songs với error handling
const getCachedTrendingSongs = unstable_cache(
  async (): Promise<ProcessedSongsData> => {
    try {
      const songs = await prisma.songs.findMany({
        include: songForListFast, // Sử dụng pattern nhanh cho home page
        orderBy: [
          { createdAt: "desc" },
          { HeartedSongs: { _count: "desc" } }, // Thêm sort theo popularity
        ],
        take: 8, // Giảm từ 10 xuống 8 để load nhanh hơn
      });

      if (!songs.length) {
        return [];
      }

      // Performance optimization: Batch create access links với timeout
      const { musicUrls, imageUrls } = await Promise.race([
        createBatchAccessLinks(songs, 3600), // 1 hour
        new Promise<{ musicUrls: string[]; imageUrls: string[] }>((_, reject) =>
          setTimeout(
            () => reject(new Error("Timeout creating access links")),
            30000
          )
        ),
      ]);

      // Transform song data với URLs đã được tạo sẵn
      const processedData = transformSongDataFull(songs, musicUrls, imageUrls);

      return processedData;
    } catch (error) {
      console.error("❌ Error in getCachedTrendingSongs:", error);
      // Return empty array instead of throwing to prevent page crash
      return [];
    }
  },
  ["home-trending-songs"],
  {
    revalidate: 900, // 15 phút
    tags: ["songs", "trending", "home"],
  }
);

// Loading component for trending songs
const TrendingSongsLoader = () => (
  <div className="mb-12 rounded">
    <div className="relative flex items-center justify-center mb-6">
      <div className="inline-block mb-2">
        <div className="relative px-3 py-1 text-sm font-medium rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
          <span className="relative z-10 text-6xl italic text-center text-[#670D2F] px-3">
            Loading songs...
          </span>
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse"></span>
        </div>
      </div>
    </div>
    <div className="relative px-16">
      <div className="flex gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="w-48 h-64 bg-gray-700 rounded-lg animate-pulse"
          />
        ))}
      </div>
    </div>
  </div>
);

// Async component for trending songs
async function TrendingSongsSection() {
  const songData = await getCachedTrendingSongs();

  if (!songData.length) {
    return (
      <div className="mb-12 rounded text-center py-8">
        <div className="text-gray-400">
          <p className="text-lg">No trending songs available</p>
          <p className="text-sm mt-2">Check back later for new music!</p>
        </div>
      </div>
    );
  }

  return <TrendingSongs songData={songData} />;
}

export default async function Page() {
  return (
    <div className="min-h-screen flex flex-col ">
      <div className="flex-1 p-4">
        <section className="relative min-h-screen overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-20 left-30 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            <div className="absolute top-1/4 right-1/3 w-72 h-72 bg-[#06923E] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          <div className="container relative z-10 mt-10 mb-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center justify-self-center">
            <div className="space-y-6">
              <div className="inline-block">
                <div className="relative px-3 py-1 text-sm font-medium rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
                  <span className="relative z-10">
                    Software Engineer & Creative Developer
                  </span>
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse"></span>
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                <div className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                  Hi, I'm
                </div>
                <RotatingText
                  texts={["Công Mạnh!", "Funny", "Patient", "Love sports"]}
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
              </h1>
              <p className="text-xl text-zinc-400 w-full ">
                Hey there! I've built this music website to help you discover
                new tracks, create personalized playlists, and connect with
                fellow music lovers in one beautiful platform.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 border-0 group relative inline-flex  items-center justify-center overflow-hidden rounded-md px-6 font-medium duration-500">
                  <div className="translate-x-0 opacity-100 transition group-hover:-translate-x-[150%] group-hover:opacity-0">
                    View Projects{" "}
                  </div>
                  <div className="z-10 absolute translate-x-[150%] opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">
                    <ArrowRight className="text-white  h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                  <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                </Button>
                <Button
                  variant="outline"
                  className="border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500"
                >
                  Contact Me
                </Button>
              </div>
              <div className="pt-4">
                <SocialLinks />
              </div>
            </div>
            <div className="flex justify-center h-full">
              {/* <CreativeHero /> */}
              <TiltedCard
                imageSrc="/twice.png"
                altText="TWICE Album Cover"
                captionText="TWICE"
                containerHeight="300px"
                containerWidth="300px"
                imageHeight="500px"
                imageWidth="500px"
                rotateAmplitude={12}
                scaleOnHover={1.2}
                showMobileWarning={false}
                showTooltip={true}
                displayOverlayContent={true}
                overlayContent={<p className="tilted-card-demo-text">TWICE</p>}
              />
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center items-start p-1">
              <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse"></div>
            </div>
          </div>

          <StepperWrapper />
        </section>

        <section className="py-12 mt-[15em] relative w-full overflow-hidden">
          <Suspense fallback={<TrendingSongsLoader />}>
            <TrendingSongsSection />
          </Suspense>

          <div className="absolute top-[1em] left-[4em] z-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15"></div>
          <div className="absolute bottom-[1em] right-[4em] z-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15"></div>
        </section>

        <section
          id="experience"
          className="py-2 relative w-full overflow-hidden justify-items-center mb-10 mt-[15em]"
        >
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
            <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
          </div>

          <div className="container relative z-10">
            <SectionHeading
              subtitle="My project include"
              title="About this project"
            />

            <div className="mt-16">
              <Timeline />
            </div>
          </div>
        </section>
      </div>

      {/* Footer always at bottom */}
      <Footer />
    </div>
  );
}
