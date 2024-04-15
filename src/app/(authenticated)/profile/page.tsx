"use client";

import { useEffect, useState } from "react";
import { User, UserProfile } from "@/app/lib/definitions";
import { saveProfile } from "@/app/lib/actions";
import { fetchProfile } from "@/app/lib/data";
import { useSDK } from "@metamask/sdk-react";

export default function page() {
  const { account, ready } = useSDK();
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    bio: "",
  });

  useEffect(() => {
    if (!ready || !account || userInfo) return;
    setUserInfo({
      uuid: account,
      address: account,
    });
  }, [ready, account]);

  useEffect(() => {
    if (!userInfo) return;
    const getProfile = async () => {
      const profile = await fetchProfile(userInfo?.uuid!);
      setProfile(profile);
      setLoading(false);
    };
    getProfile();
  }, [userInfo]);

  useEffect(() => {
    if (profile) {
      setFormData({
        email: profile.email,
        name: profile.name,
        bio: profile.bio,
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await saveProfile({
        user: userInfo!,
        ...formData,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <form
        className="m-3 flex flex-col items-start gap-3 border p-3"
        onSubmit={handleSubmit}
      >
        <input
          type="email"
          placeholder="email"
          className="border"
          value={formData?.email}
          onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="name"
          className="border"
          value={formData?.name}
          onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData({ ...formData, name: e.target.value })
          }
        />
        <textarea
          placeholder="bio"
          className="border"
          value={formData?.bio}
          onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setFormData({ ...formData, bio: e.target.value })
          }
        ></textarea>
        <button type="submit" className="bg-blue-200">
          submit
        </button>
      </form>
      <div className="flex flex-col gap-1">
        <span>{loading ? "loading" : "finished"}</span>
        <span>{account}</span>
        <span>{JSON.stringify(userInfo)}</span>
        <span>{JSON.stringify(profile)}</span>
        <span>{JSON.stringify(formData)}</span>
      </div>
    </>
  );
}
