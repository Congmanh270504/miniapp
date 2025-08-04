"use client";

interface GenreCellProps {
  genre: {
    id: string;
    name: string;
    description: string;
    songsCount: number;
    createdAt: Date;
  };
}

export function GenreCell({ genre }: GenreCellProps) {
  const firstLetter = genre.name.charAt(0).toUpperCase();

  // Generate a color based on genre name
  const getGenreColor = (name: string) => {
    const colors = [
      "bg-[#3E5F44]",
      "bg-[#5E936C]",
      "bg-[#93DA97]",
      "bg-[#78B9B5]",
      "bg-[#0F828C]",
      "bg-[#065084]",
      "bg-[#320A6B]",
      "bg-[#DD88CF]",
      "bg-[#4B164C]",
      "bg-[#000B58]",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="flex items-center gap-3 w-full">
      <div
        className={`relative h-12 w-12 rounded-full ${getGenreColor(
          genre.name
        )} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}
      >
        {firstLetter}
      </div>
      <div className="flex flex-col min-w-0 flex-1">
        <span className="font-medium text-gray-900 truncate">{genre.name}</span>
      </div>
    </div>
  );
}
