// src/lib/types/users.ts

export type GenresType = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  Songs: SongsType[];
};

export type SongsType = {
  id: string;
  cid: string;
  title: string;
  GenreId: string;
  artistId: string;
  playlistId: string;
  commentId: string;
  imageId: string;
  createdAt: Date;
  updatedAt: Date;
  Comments: CommentsType[];
  Genre: GenresType;
  Artists: ArtistsType;
  Playlists: PlaylistsType;
  Image: ImagesType;
};

export type ArtistsType = {
  id: string;
  name: string;
  bio: string;
  country: string;
  debutYear: string;
  imageId: string;
  followId: string;
  createdAt: Date;
  updatedAt: Date;
  Follows: FollowsType[];
  image: ImagesType;
  Songs: SongsType[];
};

export type ImagesType = {
  id: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  Artists?: ArtistsType;
  Users?: UsersType;
  Songs?: SongsType;
};

export type UsersType = {
  id: string;
  clerkId: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  imageId: string;
  Follows: FollowsType[];
  Comments: CommentsType[];
  image: ImagesType;
  Playlists: PlaylistsType[];
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

export type CommentsType = {
  id: string;
  userId: string;
  songId: string;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  Users: UsersType;
  Songs: SongsType;
};

export type FollowsType = {
  id: string;
  userId: string;
  artistId: string;
  createdAt: Date;
  updatedAt: Date;
  Users: UsersType;
  Artists: ArtistsType;
};
