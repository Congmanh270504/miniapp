import { useQuery } from "@tanstack/react-query";

interface SearchSong {
  id: string;
  title: string;
  artist: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  Genre: {
    name: string;
  };
  Users: {
    clerkId: string;
  };
}

interface SearchUser {
  id: string;
  clerkId: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  imageUrl: string | null;
  emailAddress: string | null;
}

interface SearchResponse {
  songs: SearchSong[];
  users: SearchUser[];
}

const fetchSearchResults = async (query: string): Promise<SearchResponse> => {
  if (!query || query.trim().length < 1) {
    return { songs: [], users: [] };
  }

  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);

  if (!response.ok) {
    // Handle specific error statuses
    if (response.status === 401) {
      throw new Error("Please sign in to search");
    }
    if (response.status === 429) {
      throw new Error("Too many search requests. Please wait a moment.");
    }
    if (response.status === 400) {
      throw new Error("Invalid search query");
    }
    throw new Error("Search failed");
  }

  return response.json();
};

export const useSearch = (query: string) => {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => fetchSearchResults(query),
    enabled: query.trim().length >= 1,
    staleTime: 10 * 1000, // Giảm từ 30s xuống 10s để fresh hơn
    refetchOnWindowFocus: false,
    retry: 1, // Chỉ retry 1 lần thay vì 3 lần default
  });
};
