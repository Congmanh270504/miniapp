"use server";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import Lightning from "@/components/ui/react-bits/backgrounds/Lightning/Lightning";
import { ArrowRight, Github, Linkedin, Mail, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SocialLinks } from "@/components/custom/social-links";
import { SectionHeading } from "@/components/ui/section-heading";
import { Timeline } from "@/components/ui/timeline";
import { prisma } from "@/utils/prisma";
import { ProcessedSongsData } from "../../types/song-types";
import { pinata } from "@/utils/config";
import { TrendingSongs } from "@/components/custom/trending-songs";
import { StepperWrapper } from "@/components/custom/stepper-wrapper";
import TiltedCard from "@/components/ui/react-bits/react-bit-component/TiltedCard/TiltedCard";

export default async function Page() {
  const data = await prisma.songs.findMany({
    include: {
      Image: true,
      Genre: true,
      HeartedSongs: true,
      Users: true, // Include user information
      Comments: {
        include: {
          Replies: {
            include: {
              Users: true,
            },
          },
          Users: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10, // Lấy 10 bài hát mới nhất
  });
  const songData: ProcessedSongsData = await Promise.all(
    data.map(async (song) => {
      // Tạo access link cho file nhạc
      const musicUrl = await pinata.gateways.private.createAccessLink({
        cid: song.fileCid,
        expires: 3600, // 1 hour
      });

      // Tạo access link cho ảnh (nếu có)
      let imageUrl = "";
      if (song.Image?.cid) {
        imageUrl = await pinata.gateways.private.createAccessLink({
          cid: song.Image.cid,
          expires: 3600, // 1 hour
        });
      }
      return {
        songId: song.id,
        title: song.title,
        slug: song.slug, // Thêm slug vào dữ liệu
        artist: song.artist,
        clerkId: song.Users.clerkId || "", // Sử dụng clerkId từ Users nếu có
        description: song.description,
        musicFile: {
          cid: song.fileCid,
          url: musicUrl,
        },
        imageFile: {
          cid: song.Image.cid,
          url: imageUrl,
        },
        genre: song.Genre.name,
        createdAt: song.createdAt,
        hearted: song.HeartedSongs,
        comments: song.Comments,
      };
    })
  );
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
                <div className="block">Hi, I'm</div>
                <div className="mt-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                  Công Mạnh
                </div>
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
                altText="Kendrick Lamar - GNX Album Cover"
                captionText="Kendrick Lamar - GNX"
                containerHeight="300px"
                containerWidth="300px"
                imageHeight="500px"
                imageWidth="500px"
                rotateAmplitude={12}
                scaleOnHover={1.2}
                showMobileWarning={false}
                showTooltip={true}
                displayOverlayContent={true}
                overlayContent={
                  <p className="tilted-card-demo-text">Kendrick Lamar - GNX</p>
                }
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
          <TrendingSongs songData={songData} />

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
