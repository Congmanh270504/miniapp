"use client";

import { useState, useRef, useEffect, useCallback, use } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Heart, MessageCircle, Send, MoreHorizontal, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import BookmarkIcon from "@/components/custom/icon/bookmark-icon";
import { MdOutlineInsertEmoticon } from "react-icons/md";
import { useUser } from "@clerk/nextjs";
import { ProcessedSongSlugPinata } from "../../../types/song-types";
import Image from "next/image";
import { toast } from "sonner";
import { deleteComment, deleteReplyComment } from "@/lib/actions/comments";

type Comment = {
  id: string;
  username: string;
  avatarUrl: string;
  content: string;
  likes: number;
  time: string;
  replies?: Comment[];
};

interface UserCreateSongInfor {
  clerkId: string;
  name: string | null;
  imageUrl: string;
}
export function CommentSection({
  currentSong,
  userCreate,
}: {
  currentSong: ProcessedSongSlugPinata;
  userCreate: UserCreateSongInfor;
}) {
  const { isSignedIn, user, isLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  // Rate limiting state - 3 requests per minute
  const [rateLimitState, setRateLimitState] = useState({
    requestCount: 0,
    firstRequestTime: 0,
    isRateLimited: false,
  });

  useEffect(() => {
    const checkUserRole = async () => {
      if (isSignedIn && isLoaded) {
        try {
          const response = await fetch("/api/user/role?role=admin");

          if (response.ok) {
            const data = await response.json();
            setIsAdmin(data.hasRole);
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error checking role:", error);
          setIsAdmin(false);
        }
      }
    };

    checkUserRole();
  }, [isSignedIn, isLoaded, user]);

  const [isPending, setIsPending] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    hasMore: true,
    isLoading: false,
  });
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    commentId: "",
    hasReplies: false,
    repliesCount: 0,
  });

  // Helper function to parse reply content and separate mention from text
  const parseReplyContent = (content: string, originalUsername: string) => {
    const mentionPattern = `@${originalUsername}`;

    if (content.startsWith(mentionPattern)) {
      const mentionPart = mentionPattern;
      const restContent = content.substring(mentionPattern.length).trim();

      return {
        hasMention: true,
        mentionPart,
        restContent,
      };
    }

    return {
      hasMention: false,
      mentionPart: "",
      restContent: content,
    };
  };

  const handleGetCommentsData = useCallback(
    async (page: number = 1, reset: boolean = true) => {
      try {
        setPagination((prev) => ({ ...prev, isLoading: true }));

        const response = await fetch(
          `/api/comments?songId=${currentSong.songId}&page=${page}&limit=20`
        );

        if (response.status !== 200) {
          throw new Error("Failed to fetch comments");
        }

        const result = await response.json();

        if (result.status && result.comments) {
          if (reset) {
            setComments(result.comments);
          } else {
            setComments((prev) => [...prev, ...result.comments]);
          }

          setPagination({
            currentPage: result.pagination.currentPage,
            hasMore: result.pagination.hasMore,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        setPagination((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [currentSong.songId]
  );

  useEffect(() => {
    if (currentSong) {
      handleGetCommentsData(1, true);
    }
  }, [currentSong, handleGetCommentsData]);

  const [expandedComments, setExpandedComments] = useState<Set<string>>(
    new Set(["2"])
  );
  const [newComment, setNewComment] = useState("");
  const commentInputRef = useRef<HTMLInputElement>(null);
  const commentsContainerRef = useRef<HTMLDivElement>(null);
  const [currentCommentId, setCurrentCommentId] = useState<string>("");

  // Load more comments function
  const loadMoreComments = useCallback(async () => {
    if (pagination.isLoading || !pagination.hasMore) return;

    try {
      setPagination((prev) => ({ ...prev, isLoading: true }));

      const response = await fetch(
        `/api/comments?songId=${currentSong.songId}&page=${
          pagination.currentPage + 1
        }&limit=20`
      );

      if (response.status !== 200) {
        throw new Error("Failed to fetch more comments");
      }

      const result = await response.json();

      if (result.status && result.comments) {
        setComments((prev) => [...prev, ...result.comments]);
        setPagination({
          currentPage: result.pagination.currentPage,
          hasMore: result.pagination.hasMore,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Error loading more comments:", error);
      setPagination((prev) => ({ ...prev, isLoading: false }));
    }
  }, [
    currentSong.songId,
    pagination.currentPage,
    pagination.hasMore,
    pagination.isLoading,
  ]);

  // Scroll event handler
  const handleScroll = useCallback(() => {
    const container = commentsContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100; // Load when 100px from bottom

    if (isNearBottom && pagination.hasMore && !pagination.isLoading) {
      loadMoreComments();
    }
  }, [loadMoreComments, pagination.hasMore, pagination.isLoading]);

  // Add scroll listener
  useEffect(() => {
    const container = commentsContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Auto-reset rate limit after 1 minute
  useEffect(() => {
    if (rateLimitState.isRateLimited) {
      const oneMinute = 60 * 1000;
      const timeUntilReset =
        oneMinute - (Date.now() - rateLimitState.firstRequestTime);

      if (timeUntilReset > 0) {
        const timeout = setTimeout(() => {
          setRateLimitState({
            requestCount: 0,
            firstRequestTime: 0,
            isRateLimited: false,
          });
        }, timeUntilReset);

        return () => clearTimeout(timeout);
      } else {
        // Reset immediately if time has already passed
        setRateLimitState({
          requestCount: 0,
          firstRequestTime: 0,
          isRateLimited: false,
        });
      }
    }
  }, [rateLimitState.isRateLimited, rateLimitState.firstRequestTime]);

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

  // Rate limiting check function
  const checkRateLimit = useCallback(() => {
    const now = Date.now();
    const oneMinute = 60 * 1000; // 1 minute in milliseconds

    // Reset if more than 1 minute has passed since first request
    if (now - rateLimitState.firstRequestTime > oneMinute) {
      setRateLimitState({
        requestCount: 1,
        firstRequestTime: now,
        isRateLimited: false,
      });
      return true;
    }

    // Check if user has exceeded 3 requests in the current minute
    if (rateLimitState.requestCount >= 3) {
      setRateLimitState((prev) => ({ ...prev, isRateLimited: true }));
      const remainingTime = Math.ceil(
        (oneMinute - (now - rateLimitState.firstRequestTime)) / 1000
      );
      toast.error(
        `Rate limit exceeded. Please wait ${remainingTime} seconds before commenting again.`
      );
      return false;
    }

    // Increment request count
    setRateLimitState((prev) => ({
      ...prev,
      requestCount: prev.requestCount + 1,
      firstRequestTime: prev.firstRequestTime || now,
    }));
    return true;
  }, [rateLimitState]);

  const handleAddComment = useCallback(async () => {
    if (newComment.trim() && comments) {
      // Check rate limit before making API call
      if (!checkRateLimit()) {
        return;
      }

      try {
        setIsPending(true);
        const request = await fetch("/api/comments/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment: newComment,
            songId: currentSong.songId,
            userId: user?.id,
          }),
        });
        if (request.status === 200) {
          toast.success("Comment added successfully");
          // Refresh the comments list to show the new comment at the top
          handleGetCommentsData(1, true);
          setPagination({
            currentPage: 1,
            hasMore: true,
            isLoading: false,
          });
        } else {
          // Revert rate limit count on failure
          setRateLimitState((prev) => ({
            ...prev,
            requestCount: Math.max(0, prev.requestCount - 1),
          }));
          toast.error("Failed to add comment");
          return;
        }
      } catch (error) {
        console.error("Error adding comment:", error);
        // Revert rate limit count on error
        setRateLimitState((prev) => ({
          ...prev,
          requestCount: Math.max(0, prev.requestCount - 1),
        }));
        toast.error("Failed to add comment");
      } finally {
        setNewComment("");
        setIsPending(false);
      }
    }
  }, [
    newComment,
    comments,
    user,
    currentSong.songId,
    handleGetCommentsData,
    checkRateLimit,
  ]);

  const handleDeleteComment = useCallback(
    async (commentId: string) => {
      if (comments) {
        // Tìm comment để kiểm tra có replies không
        const commentToDelete = comments.find((c) => c.id === commentId);
        const hasReplies =
          commentToDelete?.replies && commentToDelete.replies.length > 0;

        if (hasReplies) {
          // Mở dialog xác nhận nếu có replies
          setDeleteDialog({
            isOpen: true,
            commentId,
            hasReplies: true,
            repliesCount: commentToDelete?.replies?.length || 0,
          });
        } else {
          // Xóa trực tiếp nếu không có replies
          await executeDeleteComment(commentId);
        }
      }
    },
    [comments]
  );

  const executeDeleteComment = useCallback(
    async (commentId: string) => {
      if (comments) {
        setIsPending(true);
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        try {
          const request = await deleteComment(commentId);
          if (request.ok) {
            toast.success(request.message || "Comment deleted successfully");
          } else {
            toast.error(request.message || "Failed to delete comment");
            return;
          }
        } catch (error) {
          console.error("Error deleting comment:", error);
        } finally {
          setIsPending(false);
        }
      }
    },
    [comments]
  );

  const handleConfirmDelete = useCallback(async () => {
    await executeDeleteComment(deleteDialog.commentId);
    setDeleteDialog({
      isOpen: false,
      commentId: "",
      hasReplies: false,
      repliesCount: 0,
    });
  }, [deleteDialog.commentId, executeDeleteComment]);

  const handleDeleteReplyComment = useCallback(
    async (replyId: string, commentId: string) => {
      if (comments) {
        setIsPending(true);
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? { ...c, replies: c.replies?.filter((r) => r.id !== replyId) }
              : c
          )
        );
        try {
          const request = await deleteReplyComment(replyId);
          if (request.ok) {
            toast.success(
              request.message || "Reply comment deleted successfully"
            );
          } else {
            toast.error(request.message || "Failed to delete reply comment");
            return;
          }
        } catch (error) {
          console.error("Error deleting reply:", error);
        } finally {
          setIsPending(false);
        }
      }
    },
    [comments, user]
  );

  const handleReply = useCallback(
    async (commentId: string) => {
      if (comments) {
        // Check rate limit before making API call
        if (!checkRateLimit()) {
          return;
        }

        setIsPending(true);
        const reply: Comment = {
          id: `reply-${Date.now()}`,
          username: user?.fullName || "user",
          avatarUrl: user?.imageUrl || "/user.png",
          content: newComment,
          likes: 0,
          time: "Just now",
        };
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? { ...c, replies: [...(c.replies || []), reply] }
              : c
          )
        );
        try {
          const request = await fetch("/api/replies/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              reply: newComment,
              commentId: commentId,
              userId: user?.id,
            }),
          });
          if (request.status === 200) {
            toast.success("Reply added successfully");
          } else {
            // Revert rate limit count on failure
            setRateLimitState((prev) => ({
              ...prev,
              requestCount: Math.max(0, prev.requestCount - 1),
            }));
            toast.error("Failed to add reply");
            setComments((prev) =>
              prev.map((c) =>
                c.id === commentId
                  ? {
                      ...c,
                      replies: c.replies?.filter((r) => r.id !== reply.id),
                    }
                  : c
              )
            );
            return;
          }
        } catch (error) {
          console.error("Error setting reply comment:", error);
          // Revert rate limit count on error
          setRateLimitState((prev) => ({
            ...prev,
            requestCount: Math.max(0, prev.requestCount - 1),
          }));
        } finally {
          setNewComment("");
          setIsPending(false);
        }
      }
    },
    [newComment, comments, user, checkRateLimit]
  );

  return (
    <div className="flex flex-col gap-2 w-full h-full dark:bg-black ">
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
            {currentSong.description}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="ml-auto">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>
      {/* Comments section */}
      <div
        ref={commentsContainerRef}
        className="h-full grow overflow-y-auto p-2 no-scrollbar"
      >
        {comments && comments.length > 0 ? (
          <>
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
                        <span className="font-semibold">
                          {comment.username}
                        </span>{" "}
                        <span style={{ wordBreak: "break-word" }}>
                          {comment.content}
                        </span>
                      </div>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <span>{comment.time}</span>
                        <span className="mx-1">•</span>
                        <span>{comment.likes} likes</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto py-0 px-2"
                          onClick={() => {
                            setCurrentCommentId(comment.id);
                            setNewComment("@" + comment.username + " ");
                          }}
                        >
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div>
                    {/* <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 flex-shrink-0 inline-flex items-center justify-center rounded-md  font-medium  shadow-neutral-500/20 transition active:scale-95"
                    >
                      <Heart className="h-4 w-4" />
                    </Button> */}
                    {isAdmin ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 flex-shrink-0 inline-flex items-center justify-center rounded-md  font-medium  shadow-neutral-500/20 transition active:scale-95"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        <Flag className="h-4 w-4" />
                      </Button>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                {comment.replies && comment.replies.length > 0 && (
                  <>
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

                    {expandedComments.has(comment.id) && (
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
                                  {(() => {
                                    const parsed = parseReplyContent(
                                      reply.content,
                                      comment.username
                                    );
                                    return (
                                      <>
                                        {parsed.hasMention && (
                                          <span className="text-blue-500 cursor-pointer hover:underline">
                                            {parsed.mentionPart}
                                          </span>
                                        )}
                                        {parsed.hasMention &&
                                          parsed.restContent &&
                                          " "}
                                        <span>{parsed.restContent}</span>
                                      </>
                                    );
                                  })()}
                                </div>
                                <div className="flex items-center mt-1 text-xs text-gray-500">
                                  <span>{reply.time}</span>
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
                            <div>
                              {/* <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 flex-shrink-0 inline-flex items-center justify-center rounded-md  font-medium  shadow-neutral-500/20 transition active:scale-95"
                              >
                                <Heart className="h-4 w-4" />
                              </Button> */}
                              {isAdmin ? (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 flex-shrink-0 inline-flex items-center justify-center rounded-md  font-medium  shadow-neutral-500/20 transition active:scale-95"
                                  onClick={() =>
                                    handleDeleteReplyComment(
                                      reply.id,
                                      comment.id
                                    )
                                  }
                                >
                                  <Flag className="h-4 w-4" />
                                </Button>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {pagination.isLoading && (
              <div className="flex justify-center py-4">
                <div className="text-gray-500">Loading more comments...</div>
              </div>
            )}

            {/* End of comments indicator */}
            {!pagination.hasMore && comments.length > 0 && (
              <div className="text-center py-4 text-gray-500 text-sm">
                No more comments to load
              </div>
            )}
          </>
        ) : (
          <div className="p-4 text-gray-500">No comments yet.</div>
        )}
      </div>{" "}
      {/* Post actions */}
      <div className=" bg-white shadow-lg mt-auto dark:bg-black">
        {/* <div className="p-4 border-t">
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
        </div> */}

        <div className="flex items-center gap-2 p-4 border-t">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage
              src={user?.imageUrl ? user?.imageUrl : "/avatars/shadcn.jpg"}
              alt={user?.fullName ? user?.fullName : "CN"}
            />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Input
              ref={commentInputRef}
              type="text"
              placeholder="Add a comment..."
              className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddComment();
                }
              }}
            />
            {/* Rate limit indicator */}
            {rateLimitState.requestCount > 0 && (
              <div className="text-xs text-gray-500 mt-1">
                {rateLimitState.isRateLimited
                  ? "Rate limit reached - please wait"
                  : `${
                      3 - rateLimitState.requestCount
                    } comments remaining this minute`}
              </div>
            )}
          </div>
          {/* <Button
            variant="ghost"
            size="icon"
            className="h-8 w-4 flex-shrink-0 inline-flex items-center justify-center rounded-md px-1 font-medium  shadow-neutral-500/20 transition active:scale-95 hover:bg-transparent"
          >
            <MdOutlineInsertEmoticon className="h-4 w-4" />
          </Button> */}
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "text-blue-500 font-semibold",
              (!newComment.trim() ||
                isPending ||
                rateLimitState.isRateLimited) &&
                "opacity-50 cursor-not-allowed"
            )}
            disabled={
              !newComment.trim() || isPending || rateLimitState.isRateLimited
            }
            onClick={() => {
              if (newComment.startsWith("@")) {
                handleReply(currentCommentId);
              } else handleAddComment();
            }}
            title={
              rateLimitState.isRateLimited
                ? "Rate limit exceeded. Please wait before commenting again."
                : ""
            }
          >
            {rateLimitState.isRateLimited ? "Rate Limited" : "Post"}
          </Button>
        </div>
      </div>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) =>
          setDeleteDialog((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Comment</DialogTitle>
            <DialogDescription>
              {deleteDialog.hasReplies
                ? `This comment has ${deleteDialog.repliesCount} ${
                    deleteDialog.repliesCount === 1 ? "reply" : "replies"
                  }. Deleting this comment will also delete all its replies. This action cannot be undone.`
                : "Are you sure you want to delete this comment? This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setDeleteDialog((prev) => ({ ...prev, isOpen: false }))
              }
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
