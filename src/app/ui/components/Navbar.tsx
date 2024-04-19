"use client";
import { AuthContext } from "@/app/ui/layout/AuthProvider";
import { useContext } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ConnectButton from "@/app/ui/components/ConnectButton";

export default function Navbar() {
  const auth = useContext(AuthContext);

  return (
    <nav className="flex items-center">
      {auth?.isAuthenticated && (
        <div className="mr-4">
          <Link href="/dashboard" passHref>
            <Button variant="link">Dashboard</Button>
          </Link>
          <Link href="/chat/new" passHref>
            <Button variant="link">New Chat</Button>
          </Link>
          <Link href="/profile" passHref>
            <Button variant="link">Edit Profile</Button>
          </Link>
        </div>
      )}
      <ConnectButton />
    </nav>
  );
}
