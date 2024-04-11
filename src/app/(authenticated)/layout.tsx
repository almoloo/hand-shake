import React from "react";
import ProfileProvider from "../ui/layout/ProfileProvider";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ProfileProvider>{children}</ProfileProvider>;
}
