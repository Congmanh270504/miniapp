"use client";

import { useCallback, useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { createReview } from "@/lib/actions/reviews";
import { current } from "@reduxjs/toolkit";
import { createRepliesReview } from "@/lib/actions/replies-review";

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

const SimpleFormSchema = z.object({
  review: z
    .string()
    .min(3, {
      message: "Review must be at least 3 characters.",
    })
    .max(160, {
      message: "Review must not be longer than 160 characters.",
    }),
});

interface SimpleReviewFormProps {
  comments: Review[];
  setComments: React.Dispatch<React.SetStateAction<Review[]>>;
  reviewTextareaRef: React.RefObject<HTMLTextAreaElement | null>;
  currentCommentId: string;
}

export function SimpleReviewForm({
  comments,
  setComments,
  currentCommentId,
  reviewTextareaRef,
}: SimpleReviewFormProps) {
  const { isSignedIn, user } = useUser();
  const [isPending, setIsPending] = useState(false);
  const form = useForm<z.infer<typeof SimpleFormSchema>>({
    resolver: zodResolver(SimpleFormSchema),
    defaultValues: {
      review: "",
    },
  });

  // Auto focus textarea when component mounts (when reply is clicked)
  useEffect(() => {
    if (reviewTextareaRef.current) {
      reviewTextareaRef.current.focus();
    }
  }, [reviewTextareaRef]);

  async function onSubmit(data: z.infer<typeof SimpleFormSchema>) {
    setIsPending(true);

    // Kiểm tra người dùng có đăng nhập chưa
    if (!isSignedIn || !user) {
      redirect("/sign-in");
    }

    const newCommentObj: Review = {
      id: `new-${Date.now()}`,
      username: user?.fullName || "current_user",
      avatarUrl: user?.imageUrl || "/user.png",
      content: data.review,
      likes: 0,
      time: "Just now",
      replies: [],
    };

    const tempId = newCommentObj.id;
    setComments((prev) =>
      prev.map((c) =>
        c.id === currentCommentId
          ? { ...c, replies: [...(c.replies || []), newCommentObj] }
          : c
      )
    );
    try {
      const response = await createRepliesReview(
        currentCommentId,
        user.id,
        data.review
      );
      if (response.ok && response.data) {
        toast.success(response.message);
        return;
      } else {
        toast.error(response.message);
        setComments((prev) =>
          prev.map((c) =>
            c.id === currentCommentId
              ? {
                  ...c,
                  replies: c.replies?.filter((r) => r.id !== tempId),
                }
              : c
          )
        );
      }
    } catch (error) {
      console.error("Error adding review:", error);
      setComments((prev) =>
        prev.map((c) =>
          c.id === currentCommentId
            ? {
                ...c,
                replies: c.replies?.filter((r) => r.id !== tempId),
              }
            : c
        )
      );
      toast.error("An error occurred while adding your review.");
    } finally {
      form.reset();
      setIsPending(false);
    }
  }

  return (
    <div className="bg-white dark:bg-black shadow-lg border-b p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="review"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Add a review</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Share your thoughts about this song..."
                    className="resize-none"
                    {...field}
                    ref={(e) => {
                      field.ref(e);
                      if (reviewTextareaRef.current !== undefined) {
                        reviewTextareaRef.current = e;
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end px-2">
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                className="bg-gray-400 hover:bg-gray-400"
                onClick={() => {
                  form.reset();
                  form.clearErrors();
                }}
              >
                Reset
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Posting..." : "Post Review"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
