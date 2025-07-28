import React from "react";
import MusicLayout from "./music-layout";
import { Metadata } from "next";
import { transformSongDataWithUrls } from "@/lib/song-utils";
import { getUserByIdList } from "@/lib/actions/user";
import {
  getCachedSongsWithImages,
  getCachedUserMostUpload,
} from "@/lib/cache/songs-cache";

// Metadata for SEO optimization
export const metadata: Metadata = {
  title: "All Songs - Music Library",
  description:
    "Discover and play your favorite songs from our extensive music library",
  keywords: ["music", "songs", "playlist", "audio", "streaming"],
  openGraph: {
    title: "Music Library - All Songs",
    description: "Discover and play your favorite songs",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const Page = async () => {
  // Sử dụng cached function để lấy cả songs và images
  const { songs: data, imageUrls } = await getCachedSongsWithImages(
    1,
    10,
    3600
  ); // 10 songs, cache 1 giờ

  // Transform song data với URLs đã được cache
  const songData = transformSongDataWithUrls(data, imageUrls);

  const userUploadedSongs = await getCachedUserMostUpload();
  console.log("Users list", userUploadedSongs);

  const { users } = await getUserByIdList(userUploadedSongs);

  if (!users || users.totalCount === 0) {
    console.error("No users found for the uploaded songs");
    return <div>No users found for the uploaded songs</div>;
  }

  // Tạo mảng userCreateSongInfor từ users data
  const userCreateSongInfor = users.data.map((user: any) => ({
    clerkId: user.id,
    name: user.fullName || user.firstName + " " + user.lastName,
    imageUrl: user.imageUrl,
  }));

  return (
    <MusicLayout
      songData={songData}
      userCreateSongInfor={userCreateSongInfor}
    />
  );
};

export default Page;
