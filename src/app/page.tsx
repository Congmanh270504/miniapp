"use client";
import {
  SignedIn,
  SignedOut,
  SignIn,
  SignInButton,
  useAuth,
  UserButton,
} from "@clerk/nextjs";
import { SignOutButton } from "@clerk/nextjs";
export default function Example() {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-100">
      {/* Hello, {userId}! Your current active session is {sessionId}. */}
      <span>1</span>
      <span>2</span>
      <span>3</span>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </div>
  );
}
