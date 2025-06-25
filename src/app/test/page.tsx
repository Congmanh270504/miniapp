"use server";
import { Button } from "@/components/ui/button";
import { createManyGenres } from "@/lib/actions/genre";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchGenres } from "@/store/genres/genres";
import { getUser } from "@/lib/actions/users";
import { useUser } from "@clerk/nextjs";
import { prisma } from "@/utils/prisma";

const Page = async () => {
  // const { isSignedIn, user, isLoaded } = useUser();
  // console.log(user?.id);
  // if (user?.id) {
  // }
  const currentUser = await prisma.users.findUnique({
    where: { clerkId: "user_2ylA2VRmswaaPExCbfER7v5uzyk" },
  });
  console.log(currentUser);
  return (
    <div>
      {/* <Button onClick={createManyGenres}>aa</Button> */}
      aaaa
    </div>
  );
};

export default Page;
