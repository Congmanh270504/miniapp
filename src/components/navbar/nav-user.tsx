"use client";
import { SignOutButton } from "@clerk/nextjs";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  LogOutIcon,
  Sparkles,
  User,
} from "lucide-react";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUser } from "@clerk/nextjs";
import { Suspense, useEffect, useState } from "react";
import { Button } from "../ui/button";
import ClientOnly from "../ClientOnly";

export default function NavUser() {
  const { isMobile, state } = useSidebar();
  const { isSignedIn, user, isLoaded } = useUser();

  const LoadingSkeleton = () => (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-2 p-2">
          <div className="h-8 w-8 rounded-lg bg-gray-200 animate-pulse" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-1" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );

  if (!isLoaded) {
    return <LoadingSkeleton />;
  }

  return (
    <ClientOnly fallback={<LoadingSkeleton />}>
      <SidebarMenu>
        {user ? (
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={user.imageUrl}
                      alt={user.fullName ? user.fullName : "User"}
                    />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {user.fullName}
                    </span>
                    <span className="truncate text-xs">
                      {user.emailAddresses[0].emailAddress}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={user.imageUrl}
                        alt={user.fullName ? user.fullName : "User"}
                      />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {user.fullName}
                      </span>
                      <span className="truncate text-xs">
                        {user.emailAddresses[0].emailAddress}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Sparkles />
                    Upgrade to Pro
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Sparkles />
                    View Profile
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <CreditCard />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOutIcon />
                  <SignOutButton>
                    {/* <LogOut />
                    <span className="flex items-center gap-2"></span> */}
                    Log out
                  </SignOutButton>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ) : (
          <SidebarMenuItem>
            <div
              className={`flex items-center gap-2 p-2 transition-all duration-200 ${
                state === "collapsed" ? "justify-center" : "justify-center"
              }`}
            >
              <SignInButton mode="modal">
                <Button
                  variant="outline"
                  size={state === "collapsed" ? "icon" : "sm"}
                  className="transition-all duration-200"
                >
                  {state === "collapsed" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </SignInButton>
              {state !== "collapsed" && (
                <SignUpButton mode="modal">
                  <Button variant="outline" size="sm">
                    Sign Up
                  </Button>
                </SignUpButton>
              )}
            </div>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </ClientOnly>
  );
}
