"use client";

import { AuthContext } from "@/app/ui/layout/AuthProvider";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function ConnectButton() {
  const auth = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(
    auth?.isAuthenticated ?? false
  );

  useEffect(() => {
    setAuthenticated(auth?.isAuthenticated ?? false);
  }, [auth?.isAuthenticated]);

  const handleConnect = async () => {
    setLoading(true);
    try {
      await auth?.login();
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
      await auth?.logout();
      router.push("/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return authenticated ? (
    <button onClick={handleDisconnect}>Disconnect</button>
  ) : (
    <button onClick={handleConnect}>Connect</button>
  );
}
