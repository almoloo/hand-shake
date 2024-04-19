"use client";

import Loading from "@/app/(authenticated)/loading";
import { requestNewChat } from "@/app/lib/actions";
import { InitSessionInfo } from "@/app/lib/definitions";
import Heading from "@/app/ui/components/Heading";
import { ProfileContext } from "@/app/ui/layout/ProfileProvider";
import { PushContext } from "@/app/ui/layout/PushProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  LoaderIcon,
  MessageSquareDashedIcon,
  MessageSquarePlusIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export default function page() {
  const router = useRouter();
  const push = useContext(PushContext);
  const userProfile = useContext(ProfileContext);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<InitSessionInfo>({
    title: "",
    description: "",
    email: "",
  });

  useEffect(() => {
    if (userProfile && userProfile.user.uuid) {
      setLoading(false);
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const createdGroup = await push?.pushUser?.chat.group.create(
        sessionInfo.title,
        {
          description: sessionInfo.description,
          image: `https://effigy.im/a/${userProfile?.user.address}.png`,
        }
      );

      const response = await requestNewChat(
        userProfile!,
        sessionInfo,
        createdGroup?.chatId!
      );
      toast.success("Chat session created successfully");
      setLoading(true);
      router.push(`/chat/${response?.chatId}`);
    } catch (error) {
      toast.error("Failed to create chat session");
      console.error("🌈", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <main
      className={`flex grid-cols-3 flex-col lg:grid ${
        !push?.pushUser && "opacity-50 pointer-events-none"
      }`}
    >
      <Heading
        title="Create New Chat Session"
        description="Start a new conversation on Handshake by inviting a party to a secure and verifiable chat session."
        icon={<MessageSquareDashedIcon className="h-6 w-6" />}
        className="col-span-2"
      />
      <form
        className={`col-span-2 flex flex-col space-y-5`}
        onSubmit={handleSubmit}
      >
        <fieldset>
          <Label htmlFor="email">Recipient Email</Label>
          <Input
            type="email"
            id="email"
            placeholder="e.g. name@sample.com"
            value={sessionInfo.email}
            onChange={(e) =>
              setSessionInfo({ ...sessionInfo, email: e.target.value })
            }
            disabled={submitLoading}
            required
          />
        </fieldset>
        <fieldset>
          <Label htmlFor="title">Session Title</Label>
          <Input
            type="text"
            id="title"
            placeholder="e.g. Job Interview Prep"
            value={sessionInfo.title}
            onChange={(e) =>
              setSessionInfo({ ...sessionInfo, title: e.target.value })
            }
            disabled={submitLoading}
            required
          />
        </fieldset>
        <fieldset>
          <Label htmlFor="description">Session Description</Label>
          <Textarea
            id="description"
            placeholder="e.g. Let's prepare for the upcoming job interview together. I will help you with the questions and answers."
            value={sessionInfo.description}
            onChange={(e) =>
              setSessionInfo({ ...sessionInfo, description: e.target.value })
            }
            rows={5}
            disabled={submitLoading}
            required
          >
            {sessionInfo.description}
          </Textarea>
        </fieldset>
        <div>
          <Button type="submit" disabled={submitLoading}>
            {submitLoading ? (
              <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <MessageSquarePlusIcon className="mr-2 h-4 w-4" />
            )}
            Save Profile
          </Button>
        </div>
      </form>
    </main>
  );
}
