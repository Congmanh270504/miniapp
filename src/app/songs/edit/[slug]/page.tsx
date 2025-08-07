"use server";
import { prisma } from "@/utils/prisma";
import Image from "next/image";
import React from "react";
import EditSongForm from "./edit-song-form";
import { currentUser } from "@clerk/nextjs/server";
import FuzzyText from "@/components/ui/react-bits/FuzzyText/FuzzyText";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home, Music } from "lucide-react";
import { redirect } from "next/navigation";
import PermisstionDenined from "@/components/ui/permisstion-denined";
import SongLimitPage from "@/components/ui/song-limit";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { slug } = await params;
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const userDb = await prisma.users.findUnique({
    where: { clerkId: user.id },
  });

  if (!userDb) {
    return (
      <div className="min-h-screen bg-sidebar flex items-center justify-center px-4">
        <div className="w-full text-center justify-items-center">
          <div className="mb-8">
            <FuzzyText
              baseIntensity={0.5}
              hoverIntensity={0.6}
              enableHover={true}
              color={"#000"}
            >
              404
            </FuzzyText>
          </div>

          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            <FuzzyText
              baseIntensity={0.5}
              hoverIntensity={0.6}
              enableHover={true}
              color={"#000"}
            >
              Not found
            </FuzzyText>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            Oops! The user you're looking for doesn't exist. It might have been
            moved, changed, deleted, or you entered the wrong URL.
          </p>

          <div className="space-y-4 flex justify-center gap-4">
            <Button
              asChild
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <Link
                href="/"
                className="flex items-center justify-center gap-2 dark:text-white"
              >
                <Home className="w-4 h-4" />
                Go Home
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full dark:border-white"
            >
              <Link
                href="/songs"
                className="flex items-center justify-center gap-2"
              >
                <Music className="w-4 h-4" />
                Browse Songs
              </Link>
            </Button>
          </div>

          <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            <p>
              Need help?{" "}
              <Link
                href="/contact"
                className="text-purple-600 hover:text-purple-700 underline"
              >
                Contact us
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
  const totalSongs = await prisma.songs.count({
    where: {
      userId: userDb.id,
    },
  });
  if (totalSongs >= 20) {
    return <SongLimitPage />;
  }

  const currentSong = await prisma.songs.findFirst({
    where: { slug: slug },
    include: {
      Image: true,
      Genre: true,
      Users: true, // Include user information
    },
  });

  if (!currentSong) {
    return (
      <div className="flex w-full h-full p-4 gap-2 ">
        <div className="flex flex-col items-center justify-center w-full h-full">
          <Image
            src="/images/404.png"
            alt="Not Found"
            width={500}
            height={500}
          />
          <h1 className="text-2xl font-bold">Song Not Found</h1>
        </div>
      </div>
    );
  }

  return currentSong.userId === userDb.id ? (
    <div className="h-full px-5 py-10 ">
      <EditSongForm song={currentSong} />
    </div>
  ) : (
    <PermisstionDenined />
  );
};

export default Page;
