import Loading from "@/components/ui/loading";
import { getUserByIdList } from "@/lib/actions/user";
import { getRandomColor } from "@/lib/hepper";
import { prisma } from "@/utils/prisma";
import { unstable_cache } from "next/cache";
import React, { Suspense } from "react";
import { columns } from "./colum";
import { DataTable } from "@/components/data-table/data-table";
import { User } from "@clerk/nextjs/server";

const getcachedAdminUsers = unstable_cache(async () => {
  // Placeholder for fetching users data
  const users = await prisma.users.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  if (!users || users.length === 0) {
    return [];
  }
  const usersClerkIds = users.map((user) => user.clerkId);
  const dataUsers = await getUserByIdList(usersClerkIds);
  if (!dataUsers || !dataUsers.users || dataUsers.users.totalCount === 0) {
    console.error("No users found");
    return [];
  }
  return dataUsers;
});
const Page = async () => {
  const randomColors = getRandomColor();
  const usersData = await getcachedAdminUsers();
  if (
    !usersData ||
    !("users" in usersData) ||
    !usersData.users ||
    !Array.isArray(usersData.users.data) ||
    usersData.users.data.length === 0
  ) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No users found</h2>
          <p className="text-gray-600">
            Create your first user to get started!
          </p>
        </div>
      </div>
    );
  }
  // Transform user data for table
  const userData = usersData.users.data.map((user: User) => ({
    clerkId: user.id,
    name: user.fullName || `${user.firstName} ${user.lastName}`,
    email: user.emailAddresses?.[0]?.emailAddress || "No email",
    imageUrl: user.imageUrl || "/images/default-user.png",
    createdAt: new Date(user.createdAt).toLocaleDateString(),
  }));

  return (
    <Suspense fallback={<Loading />}>
      <div className="container mx-auto py-10 flex flex-col gap-4">
        <div className="flex items-center justify-between self-center">
          <h1 className="text-2xl font-bold" style={{ color: randomColors }}>
            Users Management
          </h1>
        </div>
        <DataTable columns={columns} data={userData} dataPage={"users"} />
      </div>
    </Suspense>
  );
};

export default Page;
