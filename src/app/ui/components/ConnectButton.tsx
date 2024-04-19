"use client";

import { AuthContext } from "@/app/ui/layout/AuthProvider";
import { Button } from "@/components/ui/button";
import { useSDK } from "@metamask/sdk-react";
import { LoaderIcon, LogOutIcon, WalletIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export default function ConnectButton({
  callToAction,
  className,
}: {
  callToAction?: string;
  className?: string;
}) {
  const { connected, ready } = useSDK();
  const auth = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      await auth?.connect().then((accounts: any) => {
        if (accounts?.[0]) {
          router.push("/dashboard");
        }
      });
    } catch (error) {
      toast.error("Failed to connect");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      await auth?.disconnect();
      router.push("/");
    } catch (error) {
      toast.error("Failed to disconnect");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (connected && callToAction) return null;

  if (!ready)
    return (
      <Button variant="secondary" disabled>
        <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );

  return connected ? (
    <Button
      onClick={handleDisconnect}
      variant="outline"
      disabled={loading}
      className={className}
    >
      {loading ? (
        <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <LogOutIcon className="mr-2 h-4 w-4" />
      )}
      Disconnect
    </Button>
  ) : (
    // <button onClick={handleConnect}>Connect {connected}</button>
    <Button
      onClick={handleConnect}
      variant={callToAction ? "default" : "secondary"}
      disabled={loading}
      className={`${className}`}
    >
      {callToAction ? (
        callToAction
      ) : (
        <>
          {loading ? (
            <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <WalletIcon className="mr-2 h-4 w-4" />
          )}
          Connect MetaMask
        </>
      )}
    </Button>
  );
}
