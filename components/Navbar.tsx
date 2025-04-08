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
    <nav>
      <div>
        <Link href="/">The Menu</Link>
      </div>
      <div>
        <SignedIn>
          <Link href="/mealplan">Mealplan</Link>
          {user?.imageUrl ? (
            <Link href="/profile">
              <Image
                src={user.imageUrl}
                alt="profile picture"
                width={40}
                height={40}
              />
            </Link>
          ) : (
            <div></div>
          )}
          <SignOutButton></SignOutButton>
        </SignedIn>
        <SignedOut>
          <button>Sign out</button>
        </SignedOut>
      </div>
    </nav>
  );
};

export default Navbar;
