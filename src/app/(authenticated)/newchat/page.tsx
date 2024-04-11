"use client";

import { sendInvitationEmail } from "@/app/lib/actions";
import { fetchProfile } from "@/app/lib/data";
import { User, UserProfile } from "@/app/lib/definitions";
import { AuthContext } from "@/app/ui/layout/AuthProvider";
import { ProfileContext } from "@/app/ui/layout/ProfileProvider";
import { useContext, useEffect, useState } from "react";

export default function page() {
  // const auth = useContext(AuthContext);
  const userProfile = useContext(ProfileContext);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  // const [profile, setProfile] = useState<UserProfile | null>(null);

  // useEffect(() => {
  //   auth?.getUserInfo()?.then((userInfo) => {
  //     setUserInfo({
  //       uuid: userInfo?.uuid!,
  //       address: userInfo?.wallets[0].public_address!,
  //     });
  //   });
  // }, [auth?.isAuthenticated]);

  // useEffect(() => {
  //   const getProfile = async () => {
  //     const profile = await fetchProfile(userInfo?.uuid!);
  //     setProfile(profile);
  //   };
  //   getProfile();
  // }, [userInfo]);

  const sendTestEmail = async () => {
    const response = await sendInvitationEmail(
      "amousavig@icloud.com",
      userProfile!,
      "asdf1234"
    );

    console.log(response);
  };
  return (
    <div>
      new chat <button onClick={sendTestEmail}>SEND TEST EMAIL</button>
      <div>{JSON.stringify(userProfile)}</div>
    </div>
  );
}
