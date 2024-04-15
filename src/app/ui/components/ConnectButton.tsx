"use client";

import { AuthContext } from "@/app/ui/layout/AuthProvider";
import { useSDK } from "@metamask/sdk-react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function ConnectButton() {
  const { connected } = useSDK();
  const auth = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      await auth?.connect();
      router.push("/dashboard");
    } catch (error) {
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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return connected ? (
    <button onClick={handleDisconnect}>Disconnect</button>
  ) : (
    <button onClick={handleConnect}>Connect {connected}</button>
  );
}
