"use client";

import { useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FaStar } from "react-icons/fa";
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

const FormSchema = z.object({
  review: z
    .string()
    .min(3, {
      message: "Review must be at least 3 characters.",
    })
    .max(160, {
      message: "Review must not be longer than 160 characters.",
    })
    .optional(),
  rating: z.number().min(1, {
    message: "Please select at least 1 star rating.",
  }),
});

interface ReviewFormProps {
  comments: Review[];
  setComments: React.Dispatch<React.SetStateAction<Review[]>>;
  form: ReturnType<typeof useForm<z.infer<typeof FormSchema>>>;
}

export function ReviewForm({ comments, setComments, form }: ReviewFormProps) {
  const { isSignedIn, user } = useUser();
  const [totalStars, setTotalStars] = useState(0);
  const [isPending, setIsPending] = useState(false);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsPending(true);
    if (totalStars < 1) {
      form.setError("rating", {
        type: "manual",
        message: "Please select at least 1 star rating.",
      });
      return;
    }

    // Kiểm tra người dùng có đăng nhập chưa
    if (!isSignedIn || !user) {
      redirect("/sign-in");
    }
    if (data.rating > 0) {
      const newCommentObj: Review = {
        id: `new-${Date.now()}`,
        username: user?.fullName || "current_user",
        avatarUrl: user?.imageUrl || "/user.png",
        content: data.review ? data.review : "",
        likes: 0,
        time: "Just now",
        rating: totalStars, // Lưu rating vào comment
        replies: [],
      };
      const tempId = newCommentObj.id;
      setComments([...comments, newCommentObj]);
      try {
        const response = await createReview(user.id, {
          review: data.review ? data.review : "",
          rating: totalStars,
        });
        if (!response.ok || !response.data) {
          toast.error(response.message);
          return;
        }
        setComments((prevComments) =>
          prevComments.map((c) =>
            c.id === tempId
              ? { ...c, id: response.data.id } // Thay fake ID bằng real ID
              : c
          )
        );
        toast.success(response.message);
      } catch (error) {
        console.error("Error adding review:", error);
        setComments((prevComments) =>
          prevComments.filter((c) => c.id !== tempId)
        );
        toast.error("An error occurred while adding your review.");
      } finally {
        form.reset();
        setTotalStars(0);
        setIsPending(false);
      }
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between px-2">
            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex justify-start gap-2">
                        {Array.from({ length: 5 }, (_, index) => (
                          <FaStar
                            key={index}
                            className={
                              totalStars > index
                                ? `text-yellow-500 cursor-pointer`
                                : `text-gray-400 cursor-pointer`
                            }
                            onClick={() => {
                              setTotalStars(index + 1);
                              field.onChange(index + 1);
                              form.clearErrors("rating");
                            }}
                          />
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {totalStars < 1 ? (
                <span className="text-sm text-gray-500">
                  {totalStars} out of 5 stars
                </span>
              ) : (
                <div className="flex items-center">
                  <span className="text-sm text-gray-500">
                    {totalStars} out of 5 stars
                  </span>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                className="bg-gray-400 hover:bg-gray-400"
                onClick={() => {
                  setTotalStars(0);
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
