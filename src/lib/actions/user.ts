import { clerkClient } from "@clerk/nextjs/server";

export async function getUserById(userId: string) {
  try {
    // Initialize the Backend SDK
    const client = await clerkClient();

    // Get the user's full Backend User object
    const user = await client.users.getUser(userId);

    return { user, error: null };
  } catch (error) {
    console.error("Error fetching user:", error);
    return { user: null, error: "Failed to fetch user" };
  }
}

export async function getUserByIdList(userIds: string[]) {
  try {
    // Initialize the Backend SDK
    const client = await clerkClient();

    // Get the user's full Backend User object
    const users = await client.users.getUserList({
      userId: userIds,
      limit: 6,
    });

    return { users, error: null };
  } catch (error) {
    console.error("Error fetching user:", error);
    return { user: null, error: "Failed to fetch user" };
  }
}
