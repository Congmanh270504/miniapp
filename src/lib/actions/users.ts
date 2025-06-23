"use server";
import { prisma } from "@/utils/prisma";
import { pinata } from "@/utils/config";

export async function createUser(data: { id: string }) {
  const user = await prisma.users.upsert({
    where: { clerkId: data.id },
    update: {},
    create: {
      clerkId: data.id,
    },
  });

  return user;
}

export async function deleteUser(data: { id: string }) {
  const user = await prisma.users.delete({
    where: { clerkId: data.id },
  });

  return user;
}
