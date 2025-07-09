import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { pinata } from "@/utils/config";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  console.log("Search API called with query:", query);

  const client = await clerkClient();

  if (!query || query.trim().length < 1) {
    console.log("Query too short or empty");
    return NextResponse.json({ songs: [], users: [] });
  }

  try {
    console.log("Starting search for:", query);

    // Parallel processing - chạy đồng thời
    const [songs, users] = await Promise.all([
      // Search for songs
      prisma.songs.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { artist: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        include: {
          Genre: {
            select: {
              name: true,
            },
          },
          Image: {
            select: {
              cid: true,
            },
          },
          Users: {
            select: {
              clerkId: true,
            },
          },
        },
        take: 4, // Giảm từ 6 xuống 4 để nhanh hơn
        orderBy: {
          createdAt: "desc",
        },
      }),

      // Search for users
      prisma.users.findMany({
        take: 3, // Giảm từ 4 xuống 3 để nhanh hơn
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    console.log("Found songs:", songs.length);
    console.log("Found users:", users.length);

    // Get song images from Pinata - simplified approach
    const songsWithImages = await Promise.all(
      songs.map(async (song) => {
        try {
          // Sử dụng pattern từ getSongsDataPinata
          const imageUrl = await pinata.gateways.private.createAccessLink({
            cid: song.Image.cid,
            expires: 3600, // 1 hour
          });
          return {
            ...song,
            imageUrl,
          };
        } catch (error) {
          console.error(
            "Error fetching song image for",
            song.title,
            ":",
            error
          );
          return {
            ...song,
            imageUrl: null,
          };
        }
      })
    );

    console.log("Songs with images:", songsWithImages.length);

    // Get user data from Clerk
    const { data } = await client.users.getUserList({
      query: query,
    });

    // const usersWithProfiles = await Promise.all(
    //   users.map(async (user) => {
    //     try {
    //       const clerkUser = await client.users.getUser(user.clerkId);

    //       return {
    //         ...user,
    //         firstName: clerkUser.firstName,
    //         lastName: clerkUser.lastName,
    //         username: clerkUser.username,
    //         imageUrl: clerkUser.imageUrl,
    //         emailAddress: clerkUser.emailAddresses[0]?.emailAddress,
    //       };
    //     } catch (error) {
    //       console.error("Error fetching user profile:", error);
    //       return {
    //         ...user,
    //         firstName: null,
    //         lastName: null,
    //         username: null,
    //         imageUrl: null,
    //         emailAddress: null,
    //       };
    //     }
    //   })
    // );

    // Filter users based on search query
    const filteredUsers = data.filter((user) => {
      const searchableText = [
        user.firstName,
        user.lastName,
        user.username,
        user.emailAddresses[0]?.emailAddress,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query.toLowerCase());
    });

    console.log("Filtered users:", filteredUsers.length);

    const result = {
      songs: songsWithImages,
      users: filteredUsers.slice(0, 4), // Limit to 4 users
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
