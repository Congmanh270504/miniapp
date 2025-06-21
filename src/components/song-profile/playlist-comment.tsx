import React from "react";
import { CommentSection } from "./comment-section";
import PlayList from "./playlist";

const PlaylistComment = () => {
  return (
    <div className="w-[35%] flex flex-col gap-2 ">
      <div className="h-2/5 overflow-y-auto  shadow-lg border border-gray-100 rounded-lg no-scrollbar animate-fade-down animate-once animate-duration-500 animate-ease-linear animate-normal">
        <PlayList />
      </div>
      <div className="h-9/10 overflow-hidden shadow-lg border border-gray-100 rounded-lg">
        <div className="w-full h-full relative bg-white rounded-lg shadow animate-fade-down animate-once animate-duration-500 animate-delay-500 animate-ease-linear animate-normal">
          <CommentSection />
        </div>
      </div>
    </div>
  );
};

export default PlaylistComment;
