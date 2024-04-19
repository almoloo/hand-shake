import { MailIcon } from "lucide-react";
import Link from "next/link";
import { MetaMaskAvatar } from "react-metamask-avatar";
import { Outfit } from "next/font/google";
import { toast } from "sonner";

const outfit = Outfit({ subsets: ["latin"] });

const handleCopy = async (address: string) => {
  try {
    await navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard");
  } catch (error) {
    toast.error("Failed to copy address to clipboard");
    console.error("Failed to copy address to clipboard", error);
  }
};

export default function ProfileCard({
  className,
  address,
  email,
  name,
  bio,
}: {
  className?: string;
  address: string;
  email: string;
  name: string;
  bio: string;
}) {
  return (
    <section className={`${className} flex flex-col border rounded-lg`}>
      <div
        className="flex cursor-pointer items-center space-x-2 rounded-t-lg border-b px-2 py-3 transition-colors hover:bg-neutral-100 active:bg-neutral-200/75"
        onClick={() => handleCopy(address)}
      >
        <MetaMaskAvatar address={address} className="h-10 w-10 shrink-0" />
        <small
          className={`${outfit.className} tracking-wide text-ellipsis overflow-hidden`}
        >
          {address}
        </small>
      </div>
      <div className="flex flex-col space-y-2 p-2">
        <small className="font-medium">{name}</small>
        <p className="mt-1 rounded bg-neutral-100 p-2 text-sm text-neutral-700">
          {bio}
        </p>
        <Link
          href={`mailto:${email ? email : ""}`}
          className="link flex items-center"
        >
          <MailIcon className="mr-2 h-4 w-4" />
          <small>{email}</small>
        </Link>
      </div>
    </section>
  );
}
