"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Heart, Flag } from "lucide-react";
import { FaStar } from "react-icons/fa";
import { UseFormReturn } from "react-hook-form";

type Review = {
  id: string;
  username: string;
  avatarUrl: string;
  content: string;
  likes: number;
  time: string;
  rating?: number;
  replies?: Review[];
};

interface ReviewListProps {
  comments: Review[];
  setComments: React.Dispatch<React.SetStateAction<Review[]>>;
  isFetching: boolean;
  form: UseFormReturn<any>;
  currentCommentId: string;
  setCurrentCommentId: React.Dispatch<React.SetStateAction<string>>;
  focusCommentInput: () => void;
  isAdmin: boolean;
}

export function ReviewList({
  comments,
  setComments,
  isFetching,
  form,
  currentCommentId,
  setCurrentCommentId,
  focusCommentInput,
  isAdmin,
}: ReviewListProps) {
  const [expandedComments, setExpandedComments] = useState<Set<string>>(
    new Set()
  );
  const [isPending, setIsPending] = useState(false);
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


  const executeDeleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const handleConfirmDelete = () => {
    executeDeleteComment(deleteDialog.commentId);
    setDeleteDialog({
      isOpen: false,
      commentId: "",
      hasReplies: false,
      repliesCount: 0,
    });
  };

  return (
    <>
      {/* Comments section */}
      <div className="flex-1 overflow-y-auto p-4 border rounded-lg shadow-lg mt-4">
        {isFetching ? (
          <div className="flex justify-center items-center h-32">
            <div className="flex gap-2 text-gray-500">
              Loading reviews...
              <span className="loading loading-spinner loading-xs"></span>
            </div>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="mb-4">
              <div className="flex">
                <Avatar className="h-8 w-8 flex-shrink-0 mr-1">
                  <img src={comment.avatarUrl} alt={comment.username} />
                </Avatar>
                <div className="flex-1">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{comment.username}</span>
                      {comment.rating && (
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }, (_, index) => (
                            <FaStar
                              key={index}
                              className={
                                comment.rating! > index
                                  ? "text-yellow-500"
                                  : "text-gray-400"
                              }
                              size={12}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="mb-2">
                      <span style={{ wordBreak: "break-word" }}>
                        {comment.content}
                      </span>
                    </div>
                    <div className="flex items-center mt-1 text-xs text-gray-500 gap-1">
                      <span>{comment.time}</span>
                      <span className="mx-1">•</span>
                      {/* <span>{comment.likes} likes</span> */}
                      <Button
                        variant="ghost"
                        size="sm"
                        data-reply-button
                        className={`h-auto py-0 px-1 ${
                          currentCommentId === comment.id ? "bg-gray-200" : ""
                        }`}
                        onClick={() => {
                          setCurrentCommentId(comment.id);
                          form.setValue("review", "@" + comment.username + " ");
                          focusCommentInput();
                        }}
                      >
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
                {/* <div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 flex-shrink-0"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      <Flag className="h-4 w-4" />
                    </Button>
                  )}
                </div> */}
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
                            <img src={reply.avatarUrl} alt={reply.username} />
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
                                {/* <span>{reply.likes} likes</span> */}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  data-reply-button
                                  className="h-auto py-0 px-2"
                                  onClick={() => {
                                    setCurrentCommentId(comment.id);
                                    form.setValue(
                                      "review",
                                      "@" + reply.username + " "
                                    );
                                    focusCommentInput();
                                  }}
                                >
                                  Reply
                                </Button>
                              </div>
                            </div>
                          </div>
                          {/* <div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 flex-shrink-0"
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                            {isAdmin && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 flex-shrink-0"
                              >
                                <Flag className="h-4 w-4" />
                              </Button>
                            )}
                          </div> */}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
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
    </>
  );
}
