"use server";
import { transformSongDataWithUrls } from "@/lib/song-utils";
import { SignIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";
import MainPage from "../all/main-page";
import { getCachedHeartedSongs } from "@/lib/cache/songs-cache";

const Page = async () => {
  const user = await currentUser();
  if (!user) {
    return <SignIn />;
  }
  const { heartedSongs, imageUrls, hasMore } = await getCachedHeartedSongs(
    user.id
  );

  const songData = transformSongDataWithUrls(heartedSongs, imageUrls);

  return (
    <MainPage
      initialSongData={songData}
      hasMore={hasMore}
      title="Hearted Songs"
    />
  );
};

export default Page;
