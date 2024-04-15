"use client";

import { MetaMaskProvider } from "@metamask/sdk-react";
import AuthProvider from "@/app/ui/layout/AuthProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MetaMaskProvider
      debug={true}
      sdkOptions={{
        dappMetadata: { name: "Handshake", url: process.env.NEXT_PUBLIC_URL },
      }}
    >
      <AuthProvider>{children}</AuthProvider>
    </MetaMaskProvider>
  );
}
