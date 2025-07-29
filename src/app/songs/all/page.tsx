import React from "react";
import { transformSongDataWithUrls } from "@/lib/song-utils";
import { getCachedSongsWithImages } from "@/lib/cache/songs-cache";
import MainPage from "./main-page";

const Page = async () => {
  // Sử dụng cached function để lấy cả songs và images
  const {
    songs: data,
    imageUrls,
    hasMore,
  } = await getCachedSongsWithImages(0, 10, 3600); // 1 giờ cache cho images

  // Transform song data với URLs đã được cache
  const songData = transformSongDataWithUrls(data, imageUrls);

  return <MainPage initialSongData={songData} hasMore={hasMore} />;
};

export default Page;
