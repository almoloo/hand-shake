"use client";

import { createContext, useEffect, useState } from "react";
import { AuthContextType, User } from "@/app/lib/definitions";
import { useSDK } from "@metamask/sdk-react";

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sdk, connected, connecting, provider, account, ready } = useSDK();

  const handleConnect = async () => {
    try {
      const accounts: any = await sdk?.connect();
      return accounts?.[0];
    } catch (error) {
      console.error("Failed to connect", error);
      return null;
    }
  };

  const handleDisconnect = async () => {
    try {
      await sdk?.terminate();
    } catch (error) {
      console.error("Failed to disconnect", error);
    }
  };

  const connect = async () => {
    if (!ready) return;

    if (connected) {
      const user: User = {
        uuid: account!,
        address: account!,
      };

      setAuthInfo({
        isAuthenticated: true,
        user,
        connect: handleConnect,
        disconnect: handleDisconnect,
      });
    } else {
      setAuthInfo({
        isAuthenticated: false,
        user: null,
        connect: handleConnect,
        disconnect: handleDisconnect,
      });
    }
  };

  const [authInfo, setAuthInfo] = useState<AuthContextType | null>({
    isAuthenticated: false,
    user: null,
    connect: handleConnect,
    disconnect: handleDisconnect,
  });

  useEffect(() => {
    connect();
  }, [ready, connected]);

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
}
