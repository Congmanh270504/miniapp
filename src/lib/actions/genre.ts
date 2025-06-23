"use server";
import { prisma } from "@/utils/prisma";

export async function createManyGenres() {
  const genres = [
    {
      name: "Pop",
      description: "Popular music with catchy melodies and simple lyrics.",
    },
    {
      name: "Hip-Hop",
      description:
        "Rhythmic music with rap vocals and street culture influence.",
    },
    {
      name: "R&B",
      description: "Smooth music emphasizing vocal expression and emotion.",
    },
    {
      name: "EDM",
      description: "Electronic dance music with energetic beats and drops.",
    },
    {
      name: "K-pop",
      description: "Korean pop music with vibrant visuals and choreography.",
    },
    {
      name: "Rock",
      description:
        "Music featuring electric guitars, drums, and powerful vocals.",
    },
    {
      name: "Indie Pop",
      description: "Independent pop with creative and alternative sounds.",
    },
    {
      name: "Lo-fi",
      description:
        "Relaxing low-fidelity music, often used for studying or relaxing.",
    },
    {
      name: "Latin",
      description: "Upbeat music with Latin American rhythms and instruments.",
    },
    {
      name: "Trap",
      description: "A subgenre of hip-hop with heavy bass and fast hi-hats.",
    },
    {
      name: "House",
      description: "Electronic dance music with repetitive 4/4 beats.",
    },
    {
      name: "Jazz",
      description: "Improvisational music with complex chords and instruments.",
    },
    {
      name: "Afrobeats",
      description:
        "Modern African music with rhythmic grooves and dance vibes.",
    },
    {
      name: "Country",
      description:
        "American folk-style music often about life and storytelling.",
    },
    {
      name: "Ambient",
      description: "Instrumental music designed to create a calm atmosphere.",
    },
  ];

  const genre = await prisma.genres.createMany({
    data: genres,
  });

  return genre;
}
