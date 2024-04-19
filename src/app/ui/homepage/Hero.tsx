import Link from "next/link";
import ConnectButton from "@/app/ui/components/ConnectButton";
import { Outfit } from "next/font/google";
import { LockKeyholeIcon } from "lucide-react";

const outfit = Outfit({ subsets: ["latin"] });

export default function Hero() {
  return (
    <section className="flex grow grid-cols-12 flex-col-reverse gap-14 py-14 lg:grid lg:items-center">
      <div className="col-start-2 col-end-8">
        <h2
          className={`${outfit.className} text-3xl font-bold leading-normal mb-5`}
        >
          Secure, Verifiable Chat Sessions on the Blockchain
        </h2>
        <p className="text-neutral-600">
          Experience the power of transparent and immutable conversations. With
          Handshake, engage in secure chat sessions powered by{" "}
          <Link href="https://push.org" className="link">
            Push Protocol
          </Link>
          , sign them using{" "}
          <Link href="https://sign.global" className="link">
            Sign Protocol
          </Link>
          , and store them on the blockchain through{" "}
          <Link href="https://filecoin.io" className="link">
            Filcoin
          </Link>{" "}
          for a verifiable proof of your interactions.
        </p>
        <ConnectButton callToAction="Get Started" className="mt-10 px-10" />
      </div>
      <div className="graph-bg col-start-8 col-end-12 flex flex-col space-y-7 rounded-2xl p-10">
        <div
          className={`${outfit.className} message-bubble message-bubble-top`}
        >
          <span className="font-medium">Alice</span>
          <div>
            <p className="text-neutral-100">
              Hello Bob! Are you ready for our meeting today?
            </p>
          </div>
        </div>
        <LockKeyholeIcon className="h-8 w-8 self-center text-neutral-500" />
        <div
          className={`${outfit.className} message-bubble message-bubble-bottom`}
        >
          <span className="font-medium">Bob</span>
          <div>
            <p className="text-neutral-100">
              I'm looking forward to our conversation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
