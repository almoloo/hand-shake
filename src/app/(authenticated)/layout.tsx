"use client";

import React, { useContext, useEffect } from "react";
import ProfileProvider from "@/app/ui/layout/ProfileProvider";
import PushProvider from "@/app/ui/layout/PushProvider";
// import { AuthContext } from "@/app/ui/layout/AuthProvider";
import { useSDK } from "@metamask/sdk-react";
// import { useRouter } from "next/navigation";
import Loading from "@/app/(authenticated)/loading";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { connected, ready } = useSDK();
  // const auth = useContext(AuthContext);
  // const router = useRouter();

  // useEffect(() => {
  //   if (ready && !connected) {
  //     router.push("/");
  //   }
  // }, [ready, connected]);

  return ready ? (
    <ProfileProvider>
      <PushProvider>{children}</PushProvider>
    </ProfileProvider>
  ) : (
    <Loading />
  );
}
