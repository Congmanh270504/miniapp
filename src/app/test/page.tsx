import { clerkClient } from "@clerk/nextjs/server";
import Image from "next/image";
import React from "react";

const page = async () => {
  // const client = await clerkClient();
  // const { data, totalCount } = await client.users.getUserList({
  //   orderBy: "-created_at",
  //   limit: 10,
  // });
  // console.log("Users:", data, totalCount);
  return (
    <div className="w-full h-full relative">
      <Image
        src="/4.jpg"
        fill
        alt="Picture of the author"
        className="object-cover rounded-xl p-4"
      />
    </div>
  );
};

export default page;
