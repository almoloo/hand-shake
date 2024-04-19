import { CircleDashedIcon, CoffeeIcon, GithubIcon } from "lucide-react";
import Link from "next/link";

export default function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={`${className} flex items-center justify-between px-10 py-5 border-t`}
    >
      <small>
        <CoffeeIcon className="mr-2 inline-block h-5 w-5 text-neutral-500" />
        Designed and developed by{" "}
        <Link href={"https://github.com/almoloo"} className="link">
          @almoloo
        </Link>
      </small>
      <Link href="https://github.com/almoloo/hand-shake" className="link">
        <GithubIcon className="h-5 w-5" />
      </Link>
    </footer>
  );
}
