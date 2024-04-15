import React from "react";
import ProfileProvider from "@/app/ui/layout/ProfileProvider";
import PushProvider from "@/app/ui/layout/PushProvider";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProfileProvider>
      <PushProvider>{children}</PushProvider>
    </ProfileProvider>
  );
}
