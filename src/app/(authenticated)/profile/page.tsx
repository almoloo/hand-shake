"use client";

import { useEffect, useState } from "react";
import { User } from "@/app/lib/definitions";
import { saveProfile } from "@/app/lib/actions";
import { fetchProfile } from "@/app/lib/data";
import { useSDK } from "@metamask/sdk-react";
import Loading from "@/app/(authenticated)/loading";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { EyeIcon, LoaderIcon, SaveIcon, UserRoundCogIcon } from "lucide-react";
import Heading from "@/app/ui/components/Heading";
import ProfileCard from "@/app/ui/profile/ProfileCard";

export default function page() {
  const { account, ready } = useSDK();
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<User | null>(null);
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
      setFormData(profile);
      setLoading(false);
    };
    getProfile();
  }, [userInfo]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      await saveProfile({
        user: userInfo!,
        ...formData,
      });
      toast.success("Profile saved successfully");
    } catch (error) {
      toast.error("Failed to save profile");
      console.error(error);
    } finally {
      setSubmitLoading(false);
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <main className="flex grid-cols-3 flex-col space-x-10 lg:grid">
      <section className="col-span-2">
        <Heading
          title="Edit Profile"
          description="This information will be included in chat invitation emails, making your invitations more recognizable and meaningful. Create a profile that represents you and your conversations."
          icon={<UserRoundCogIcon className="h-6 w-6" />}
        />
        <form className="flex flex-col space-y-5" onSubmit={handleSubmit}>
          <fieldset>
            <Label htmlFor="name-input">Name</Label>
            <Input
              id="name-input"
              placeholder="e.g. John Doe"
              type="text"
              value={formData?.name ?? ""}
              onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, name: e.target.value })
              }
              disabled={submitLoading}
              required
            />
          </fieldset>
          <fieldset>
            <Label htmlFor="email-input">Email</Label>
            <Input
              id="email-input"
              placeholder="e.g. name@sample.com"
              type="email"
              value={formData?.email ?? ""}
              onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, email: e.target.value })
              }
              disabled={submitLoading}
              required
            />
          </fieldset>
          <fieldset>
            <Label htmlFor="bio-input">Bio</Label>
            <Textarea
              id="bio-input"
              placeholder="Briefly introduce yourself. Share a little about your interests or background."
              value={formData?.bio ?? ""}
              onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              rows={5}
              disabled={submitLoading}
              required
            ></Textarea>
          </fieldset>
          <div>
            <Button type="submit" disabled={submitLoading}>
              {submitLoading ? (
                <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <SaveIcon className="mr-2 h-4 w-4" />
              )}
              Save Profile
            </Button>
          </div>
        </form>
      </section>
      <section>
        <Heading
          title="Profile Preview"
          description="This is how your profile will appear to others in chat invitation emails."
          icon={<EyeIcon className="h-6 w-6" />}
        />
        <ProfileCard
          className="row-span-1"
          address={userInfo?.address!}
          email={formData?.email || ""}
          name={formData?.name || ""}
          bio={formData?.bio || ""}
        />
      </section>
    </main>
  );
}
