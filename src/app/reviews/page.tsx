"use client";

import { useState, useRef, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUser } from "@clerk/nextjs";
import { getReviews, getReviewsWithUserData } from "@/lib/actions/reviews";
import { ReviewForm } from "@/components/reviews/review-form";
import { ReviewList } from "@/components/reviews/review-list";
import { SimpleReviewForm } from "@/components/reviews/simple-review-form";

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
    .min(10, {
      message: "Review must be at least 10 characters.",
    })
    .max(160, {
      message: "Review must not be longer than 160 characters.",
    })
    .optional(),
  rating: z.number().min(1, {
    message: "Please select at least 1 star rating.",
  }),
});

const Page = () => {
  const [comments, setComments] = useState<Review[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [currentCommentId, setCurrentCommentId] = useState<string>("");
  const [isAdmin] = useState(true); // Set to true for demo
  const reviewTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      review: "",
      rating: 0,
    },
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsFetching(true);
        const reviewData = await getReviews().then(async (data) => {
          if (!data || data.length === 0) {
            return [];
          }
          return await getReviewsWithUserData(data);
        });
        setComments(reviewData);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      // Check if click is outside reply buttons and form area
      if (!target.closest("[data-reply-button]") && !target.closest("form")) {
        setCurrentCommentId("");
        form.setValue("review", ""); // Only clear the review field, not the entire form
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [form]);

  const focusCommentInput = () => {
    if (reviewTextareaRef.current) {
      reviewTextareaRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-white dark:bg-black p-4">
      {currentCommentId === "" ? (
        <ReviewForm comments={comments} setComments={setComments} form={form} />
      ) : (
        <SimpleReviewForm
          comments={comments}
          setComments={setComments}
          currentCommentId={currentCommentId}
          reviewTextareaRef={reviewTextareaRef}
        />
      )}

      <ReviewList
        comments={comments}
        setComments={setComments}
        isFetching={isFetching}
        form={form}
        currentCommentId={currentCommentId}
        setCurrentCommentId={setCurrentCommentId}
        focusCommentInput={focusCommentInput}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default Page;
