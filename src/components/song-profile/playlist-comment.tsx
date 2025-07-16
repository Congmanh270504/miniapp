import React from "react";
import { CommentSection } from "./comment-section";
import LazyPlaylist from "./lazy-playlist";
import {
  ProcessedSongsData,
  SongWithIncludes,
} from "../../../types/song-types";
import { getUserById } from "@/lib/actions/user";

const PlaylistComment = async ({
  comments,
  songs,
  currentSong,
}: {
  comments: SongWithIncludes["Comments"];
  songs: ProcessedSongsData;
  currentSong: string;
}) => {
  // Lọc bỏ bài hát hiện tại khỏi playlist
  const playList = songs.filter((song) => song.songId !== currentSong);

  // Tìm bài hát hiện tại để lấy clerkId
  const currentSongData = songs.find((song) => song.songId === currentSong);

  if (!currentSongData) {
    return (
      <div>
        <p>Current song not found in the playlist</p>
      </div>
    );
  }

  const userClerk = await getUserById(currentSongData.clerkId);
  if (!userClerk || !userClerk.user) {
    return (
      <div>
        <p>User not found for the current song</p>
      </div>
    );
  }
  const userCreateSongInfor = {
    clerkId: userClerk.user.id,
    name: userClerk.user.fullName,
    imageUrl: userClerk.user.imageUrl,
  };
  return (
    <div className="w-[35%] flex flex-col gap-2 ">
      <div className="h-2/5 shadow-lg border border-gray-100 rounded-lg animate-fade-down animate-once animate-duration-500 animate-ease-linear animate-normal">
        <LazyPlaylist initialPlaylist={playList} currentSongId={currentSong} />
      </div>
      <div className="h-9/10 overflow-hidden shadow-lg border border-gray-100 rounded-lg">
        <div className="w-full h-full relative bg-white rounded-lg shadow animate-fade-down animate-once animate-duration-500 animate-delay-500 animate-ease-linear animate-normal">
          <CommentSection
            description={currentSongData.description}
            commentData={comments}
            userCreate={userCreateSongInfor}
          />
        </div>
      </div>
    </div>
  );
};

export default PlaylistComment;
