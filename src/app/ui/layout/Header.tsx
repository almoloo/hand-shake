import { HandshakeIcon } from "lucide-react";
import Link from "next/link";
import { Outfit } from "next/font/google";
import Navbar from "@/app/ui/components/Navbar";

const outfit = Outfit({ subsets: ["latin"] });

export default function Header({ className }: { className?: string }) {
  return (
    <header
      className={`${className} flex items-center justify-between border-b px-10 py-3`}
    >
      <Link href="/" className="flex items-center space-x-2 text-indigo-950">
        <HandshakeIcon className="h-8 w-8" />
        <h1 className={`text-2xl font-bold ${outfit.className}`}>Handshake</h1>
      </Link>
      <Navbar />
    </header>
  );
}
