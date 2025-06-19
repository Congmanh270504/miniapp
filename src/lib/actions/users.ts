"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/utils/prisma";
import { ObjectId } from "mongodb";
import { pinata } from "@/utils/config";
import { UsersType } from "../types/users";

interface CreateUserParams {
  id: string;
  email_addresses: string;
  first_name: string;
  last_name: string;
  image_url: string;
}
export async function createUser(data: CreateUserParams) {
  const image = await prisma.images.create({
    data: {
      url: data.image_url,
    },
  });

  const user = await prisma.users.upsert({
    where: { clerkId: data.id },
    update: {
      email: data.email_addresses,
      name: `${data.first_name} ${data.last_name}`,
      imageId: image.id,
    },
    create: {
      clerkId: data.id,
      email: data.email_addresses,
      name: `${data.first_name} ${data.last_name}`,
      imageId: image.id,
    },
  });

  return user;
}
