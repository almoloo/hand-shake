"use client";

import { User, UserProfile } from "@/app/lib/definitions";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "@/app/ui/layout/AuthProvider";
import { fetchProfile } from "@/app/lib/data";

export const ProfileContext = createContext<UserProfile | null>(null);

export default function ProfileProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    setUserInfo({
      uuid: auth?.user?.uuid!,
      address: auth?.user?.address!,
    });
  }, [auth?.isAuthenticated]);

  useEffect(() => {
    const getProfile = async () => {
      const profile = await fetchProfile(userInfo?.uuid!);
      setUserProfile(profile);
    };
    getProfile();
  }, [userInfo]);

  return (
    <ProfileContext.Provider value={userProfile}>
      {children}
    </ProfileContext.Provider>
  );
}
