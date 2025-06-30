export type GenresType = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  Songs: SongsType[];
};

export type ImagesSongsType = {
  id: string;
  cid: string;
  createdAt: Date;
  updatedAt: Date;
  Songs?: SongsType;
};

export type UsersType = {
  id: string;
  clerkId: string;
  createdAt: Date;
  updatedAt: Date;
  
  Songs: SongsType[];
  Follows: FollowsType[];
  Comments: CommentsType[];
  Playlists: PlaylistsType[];
  CommentsReplies: CommentsRepliesType[];
};

export type PlaylistsType = {
  id: string;
  name: string;
  description: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  Users: UsersType;
  Songs: SongsType[];
};

export type SongsType = {
  id: string;
  title: string;
  artist: string;
  fileCid: string;
  imageId: string;
  genreId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;

  Comments: CommentsType[];
  Genre: GenresType;
  Playlists: PlaylistsType[];
  Image: ImagesSongsType;
  Users: UsersType;
  HeartedSongs: HeartedSongsType;
};

export type CommentsType = {
  id: string;
  userId: string;
  songId: string;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  Replies: CommentsRepliesType[];
  Users: UsersType;
  Songs: SongsType;
};

export type CommentsRepliesType = {
  id: string;
  userId: string;
  commentId: string;
  reply: string;
  createdAt: Date;
  updatedAt: Date;
  Users: UsersType;
  Comments: CommentsType;
};

export type FollowsType = {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  Users: UsersType;
};
export type HeartedSongsType = {
  id: string;
  userId: string;
  songId: string;
  createdAt: Date;
  updatedAt: Date;
  Users: UsersType;
  Songs: SongsType;
};

export type SongWithUrls = {
  songId: string;
  title: string;
  artist: string;
  musicFile: {
    cid: string;
    url: string;
  };
  imageFile: {
    cid: string;
    url: string;
  };
  genre: string;
  createdAt: Date;
  hearted: number;
};

export type SongWithSlug = {
  id: string;
  title: string;
  artist: string;
  fileCid: string;
  imageId: string;
  genreId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  Image: ImagesSongsType;
  HeartedSongs: HeartedSongsType;
  Comments: CommentsType[];
};
