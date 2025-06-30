// Types based on Prisma schema for Songs query with includes

export interface User {
  id: string;
  clerkId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ImagesSongs {
  id: string;
  cid: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface HeartedSong {
  id: string;
  userId: string;
  songId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentsReply {
  id: string;
  userId: string;
  commentId: string;
  reply: string;
  createdAt: Date;
  updatedAt: Date;
  Users: User;
}

export interface Comment {
  id: string;
  userId: string;
  songId: string | null;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  Users: User;
  Replies: CommentsReply[];
}
export type Genres = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};
export interface SongWithIncludes {
  id: string;
  title: string;
  artist: string;
  description: string;
  fileCid: string;
  Genre: Genres;
  userId: string;
  imageId: string;
  createdAt: Date;
  updatedAt: Date;
  Image: ImagesSongs;
  HeartedSongs: HeartedSong[];
  Comments: Comment[];
  Users: User; // Include user information
}

export type SongsData = SongWithIncludes[];

export interface MusicFile {
  cid: string;
  url: string;
}

export interface ImageFile {
  cid: string;
  url: string;
}

export interface ProcessedSongData {
  songId: string;
  title: string;
  artist: string;
  musicFile: MusicFile;
  imageFile: ImageFile;
  genre: string;
  createdAt: Date;
  hearted: number;
  comments: Comment[];
}

export interface ProcessedSongWithPinata {
  songId: string;
  title: string;
  artist: string;
  clerkId: string; // Clerk ID của user tạo bài hát
  description: string;
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
  hearted: HeartedSong[];
  comments: Comment[];
}

export type ProcessedSongsData = ProcessedSongWithPinata[];
