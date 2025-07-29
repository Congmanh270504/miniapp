// Shared Prisma include patterns để tái sử dụng across app

// Pattern cơ bản cho Songs với tất cả relations cần thiết
export const songWithAllRelations = {
  Image: true,
  Genre: true,
  Users: true,
  HeartedSongs: true,
  Comments: {
    include: {
      Users: true,
      Replies: {
        include: {
          Users: true,
        },
      },
    },
  },
} as const;

// Pattern tối ưu cho danh sách (ít relations hơn nhưng vẫn có Comments)
export const songForList = {
  Image: true,
  Genre: true,
  Users: true,
  HeartedSongs: true,
  Comments: {
    include: {
      Users: true,
      Replies: {
        include: {
          Users: true,
        },
      },
    },
  },
} as const;

// Pattern cho performance cao (không có Comments)
export const songForListFast = {
  Image: true,
  Genre: true,
  Users: true,
  HeartedSongs: true,
  Comments: true,
} as const;

// Pattern cho search results (minimal data)
export const songForSearch = {
  Image: {
    select: {
      cid: true,
    },
  },
  Genre: {
    select: {
      name: true,
    },
  },
  Users: {
    select: {
      clerkId: true,
    },
  },
  _count: {
    select: {
      HeartedSongs: true,
      Comments: true,
    },
  },
} as const;

// Pattern cho user profile
export const userWithSongs = {
  Songs: {
    include: songForList,
  },
  HeartedSongs: {
    include: {
      Songs: {
        include: songForList,
      },
    },
  },
  Comments: {
    include: {
      Songs: {
        select: {
          title: true,
          slug: true,
        },
      },
    },
  },
} as const;

// Pattern cho comments với user info
export const commentWithUser = {
  Users: true,
  Replies: {
    include: {
      Users: true,
    },
  },
} as const;
