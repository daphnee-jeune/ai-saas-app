"use client";

import Link from "next/link";
import { SignedIn, SignedOut, useUser, SignOutButton } from "@clerk/nextjs";
import Image from "next/image";

const Navbar = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  if (isLoaded) {
    <p>Loading...</p>;
  }
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/">The Menu</Link>

        <div className="space-x-6 flex items-center">
          <SignedIn>
            <Link
              href="/mealplan"
              className="text-gray-700 hover:text-emerald-500 transition-colors"
            >
              Mealplan
            </Link>
            {user?.imageUrl ? (
              <Link href="/profile">
                <Image
                  src={user.imageUrl}
                  alt="profile picture"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </Link>
            ) : (
              // placeholder for users without a profile picture
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            )}
            <SignOutButton>
              <button className="ml-4 px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition">
                Sign out
              </button>
            </SignOutButton>
          </SignedIn>
          <SignedOut></SignedOut>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
