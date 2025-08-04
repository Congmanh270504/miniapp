"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserCellProps {
  user: {
    clerkId: string;
    name: string;
    email: string;
    imageUrl: string;
    createdAt: string;
  };
}

export function UserCell({ user }: UserCellProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex items-center gap-3">
      <Avatar className="w-10 h-10">
        <AvatarImage
          src={user.imageUrl}
          alt={user.name}
          className="object-cover"
        />
        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium">
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <p className="font-medium text-sm">{user.name}</p>
        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
          {user.email}
        </p>
      </div>
    </div>
  );
}
