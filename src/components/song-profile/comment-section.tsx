"use client";

import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, MessageCircle, Send, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import BookmarkIcon from "@/components/custom/icon/bookmark-icon";
import { MdOutlineInsertEmoticon } from "react-icons/md";
import { useUser } from "@clerk/nextjs";
import { SongWithIncludes } from "../../../types/song-types";
import Image from "next/image";
type Comment = {
  id: string;
  username: string;
  isVerified?: boolean;
  avatarUrl: string;
  content: string;
  likes: number;
  timeAgo: string;
  replies?: Comment[];
};

const initialComments: Comment[] = [
  {
    id: "1",
    username: "traghippp",
    avatarUrl: "/user.png",
    content: "trời ơi nó đẹp. mà nó đáng yêu. mà nó cơ bắp 😂",
    likes: 291,
    timeAgo: "1d",
    replies: [],
  },
  {
    id: "2",
    username: "rare1.official",
    avatarUrl: "/user.png",
    content: "Love from INDIA ɴɪɴɪɴɪɴɪɴɪɴɪɴɴ keep up the hard work MTP",
    likes: 278,
    timeAgo: "1d",
    replies: [
      {
        id: "2-1",
        username: "kartik1999_humor",
        avatarUrl: "/user.png",
        content:
          "Look how much support you are getting from India😊 #gladtohelp",
        likes: 5,
        timeAgo: "1d",
      },
      {
        id: "2-2",
        username: "kartik1999_humor",
        avatarUrl: "/user.png",
        content:
          "Look how much support you are getting from India😊 #gladtohelp",
        likes: 5,
        timeAgo: "1d",
      },
    ],
  },
  {
    id: "3",
    username: "lareine.art",
    avatarUrl: "/user.png",
    content: "❤️ ❤️",
    likes: 3,
    timeAgo: "1d",
    replies: [],
  },
  {
    id: "4",
    username: "lareine.art",
    avatarUrl: "/user.png",
    content: "❤️ ❤️",
    likes: 3,
    timeAgo: "1d",
    replies: [],
  },
  {
    id: "5",
    username: "lareine.art",
    avatarUrl: "/user.png",
    content: "❤️ ❤️",
    likes: 3,
    timeAgo: "1d",
    replies: [],
  },
  {
    id: "6",
    username: "lareine.art",
    avatarUrl: "/user.png",
    content:
      " fhkjadsfhjkadslkfasdkjhfklasdkflasdkfjaldks fhjkasdfhaskjdhflaasdkjhflasdkf fhkjadsfhjkadslkfasdkjhfklasdkflasdkfjaldksfhjkasdfhaskjdhflaasdkjhflasdkf",
    likes: 3,
    timeAgo: "1d",
    replies: [],
  },
  {
    id: "7",
    username: "lareine.art",
    avatarUrl: "/user.png",
    content: "❤️ ❤️",
    likes: 3,
    timeAgo: "1d",
    replies: [],
  },
];
interface UserCreateSongInfor {
  clerkId: string;
  name: string | null;
  imageUrl: string;
}
export function CommentSection({
  commentData,
  userCreate,
  description,
}: {
  commentData: SongWithIncludes["Comments"];
  userCreate: UserCreateSongInfor;
  description: string;
}) {
  const { isSignedIn, user, isLoaded } = useUser();

  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(
    new Set(["2"])
  );
  const [newComment, setNewComment] = useState("");
  const commentInputRef = useRef<HTMLInputElement>(null);

  const toggleReplies = (commentId: string) => {
    setExpandedComments((prev) => {
      const updated = new Set(prev);
      if (updated.has(commentId)) {
        updated.delete(commentId);
      } else {
        updated.add(commentId);
      }
      return updated;
    });
  };

  const focusCommentInput = () => {
    if (commentInputRef.current) {
      commentInputRef.current.focus();
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: `new-${Date.now()}`,
        username: "user",
        avatarUrl: "/user.png",
        content: newComment,
        likes: 0,
        timeAgo: "Just now",
        replies: [],
      };

      setComments([...comments, comment]);
      setNewComment("");
    }
  };
  const handleReply = (commentId: string) => {
    setNewComment(
      "@" + comments.find((c) => c.id === commentId)?.username + " "
    );
    // tạo 1 biến aa lưu người dùng mình muốn reply
    // => thay đổi cái hàm handleAddComment nếu biến aa != null thì reply cho user đó
    // kết thúc reset lại biến aa === null

    // const comment = comments.find((c) => c.id === commentId);
    // if (comment) {
    //   const reply: Comment = {
    //     id: `reply-${Date.now()}`,
    //     username: "user",
    //     avatarUrl: "/user.png",
    //     content: newComment,
    //     likes: 0,
    //     timeAgo: "Just now",
    //   };

    //   setComments((prev) =>
    //     prev.map((c) =>
    //       c.id === commentId
    //         ? { ...c, replies: [...(c.replies || []), reply] }
    //         : c
    //     )
    //   );
    //   setNewComment("");
    // }
  };

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      {/* Post header */}
      <div className="flex items-center p-4 border-b gap-2">
        <Avatar className="h-8 w-8 mr-2 relative">
          <Image src={userCreate.imageUrl} alt="Profile" fill />
        </Avatar>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-sm">
            <span className="font-semibold">{userCreate.name}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="20"
              height="20"
              viewBox="0 0 48 48"
            >
              <polygon
                fill="#42a5f5"
                points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"
              ></polygon>
              <polygon
                fill="#fff"
                points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"
              ></polygon>
            </svg>
            <span className="ml-1 text-blue-500 font-medium">Follow</span>
          </div>
          <div className="text-gray-500 text-base ">
            {description}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="ml-auto">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Comments section */}
      <div className="h-10 grow overflow-y-auto p-2 no-scrollbar">
        {comments.map((comment) => (
          <div key={comment.id} className="mb-4">
            <div className="flex">
              <Avatar className="h-8 w-8 flex-shrink-0 mr-1">
                <img
                  src={comment.avatarUrl || "/placeholder.svg"}
                  alt={comment.username}
                />
              </Avatar>
              <div className="flex-1">
                <div className="flex flex-col">
                  <div>
                    <span className="font-semibold">{comment.username}</span>{" "}
                    <span style={{ wordBreak: "break-word" }}>
                      {comment.content}
                    </span>
                  </div>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <span>{comment.timeAgo}</span>
                    <span className="mx-1">•</span>
                    <span>{comment.likes} likes</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto py-0 px-2"
                      onClick={() => handleReply(comment.id)}
                    >
                      Reply
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto py-0 px-2"
                    >
                      See translation
                    </Button>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0 inline-flex items-center justify-center rounded-md  font-medium  shadow-neutral-500/20 transition active:scale-95"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>

            {comment.replies && comment.replies.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="ml-10 mt-1 text-gray-500 h-auto py-0 px-0"
                onClick={() => toggleReplies(comment.id)}
              >
                <div className="flex items-center">
                  <div className="w-6 border-t border-gray-300"></div>
                  <span className="ml-2">
                    {expandedComments.has(comment.id)
                      ? "Hide replies"
                      : `View replies (${comment.replies.length})`}
                  </span>
                </div>
              </Button>
            )}

            {expandedComments.has(comment.id) && comment.replies && (
              <div className="ml-10 mt-2">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="flex mb-3">
                    <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
                      <img
                        src={reply.avatarUrl || "/placeholder.svg"}
                        alt={reply.username}
                      />
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex flex-col">
                        <div>
                          <span className="font-semibold">
                            {reply.username}
                          </span>{" "}
                          <span className="text-blue-500 cursor-pointer hover:underline">
                            @{comment.username}
                          </span>{" "}
                          <span>{reply.content}</span>
                        </div>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <span>{reply.timeAgo}</span>
                          <span className="mx-1">•</span>
                          <span>{reply.likes} likes</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto py-0 px-2"
                          >
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 flex-shrink-0 inline-flex items-center justify-center rounded-md  font-medium  shadow-neutral-500/20 transition active:scale-95 "
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Post actions */}
      <div className=" bg-white shadow-lg mt-auto">
        <div className="p-4 border-t">
          <div className="flex items-center mb-3">
            <Button
              variant="ghost"
              size="icon"
              className=" hover:bg-transparent"
            >
              <Heart className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className=" hover:bg-transparent"
              onClick={focusCommentInput}
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className=" hover:bg-transparent"
              onClick={handleAddComment}
            >
              <Send className="h-6 w-6" />
            </Button>
            <BookmarkIcon size={24} />
          </div>
          <div className="text-sm font-semibold mb-1">
            Liked by <span className="font-semibold">_ttruc.niiiii_</span> and{" "}
            <span className="font-semibold">236,806 others</span>
          </div>
          <div className="text-xs text-gray-500 mb-3">1 day ago</div>
        </div>

        <div className="flex items-center gap-2 p-4 border-t">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage
              src={user?.imageUrl ? user?.imageUrl : "/avatars/shadcn.jpg"}
              alt={user?.fullName ? user?.fullName : "CN"}
            />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <Input
            ref={commentInputRef}
            type="text"
            placeholder="Add a comment..."
            className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddComment();
              }
            }}
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-4 flex-shrink-0 inline-flex items-center justify-center rounded-md px-1 font-medium  shadow-neutral-500/20 transition active:scale-95 hover:bg-transparent"
          >
            <MdOutlineInsertEmoticon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "text-blue-500 font-semibold",
              !newComment.trim() && "opacity-50 cursor-not-allowed"
            )}
            disabled={!newComment.trim()}
            onClick={() => {
              if (newComment.startsWith("@")) {
                console.log(newComment);
              } else handleAddComment();
            }}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
}
