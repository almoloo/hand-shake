"use client";

import Loading from "@/app/(authenticated)/loading";
import { requestNewChat } from "@/app/lib/actions";
import { InitSessionInfo } from "@/app/lib/definitions";
import Heading from "@/app/ui/components/Heading";
import { ProfileContext } from "@/app/ui/layout/ProfileProvider";
import { PushContext } from "@/app/ui/layout/PushProvider";
import { MessageSquareDashedIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";

export default function page() {
  const push = useContext(PushContext);
  const userProfile = useContext(ProfileContext);
  const [loading, setLoading] = useState(true);
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

  const requestChat = async (e: React.FormEvent) => {
    e.preventDefault();
    // const pushApi: any = push?.pushUser;
    const createdGroup = await push?.pushUser?.chat.group.create(
      sessionInfo.title,
      {
        description: sessionInfo.description,
        image: `https://effigy.im/a/${userProfile?.user.address}.png`,
      }
    );
    console.log("💀", createdGroup);
    const response = await requestNewChat(
      userProfile!,
      sessionInfo,
      createdGroup?.chatId!
    );

    console.log("⚽️", response);
  };

  return loading ? (
    <Loading />
  ) : (
    <div>
      <Heading
        title="Create New Chat Session"
        description="Start a new conversation on Handshake. Invite a party to a secure and verifiable chat session. Once the chat is complete, you can sign and store it on the blockchain for a trusted record of your interaction."
        icon={<MessageSquareDashedIcon className="h-6 w-6" />}
      />
      new chat ({loading ? "loading" : "loaded"})
      <form
        className="m-3 flex flex-col items-start gap-3 border p-3"
        onSubmit={requestChat}
      >
        <input
          type="email"
          placeholder="email"
          value={sessionInfo.email}
          onChange={(e) =>
            setSessionInfo({ ...sessionInfo, email: e.target.value })
          }
          className="border"
        />
        <input
          type="text"
          placeholder="title"
          value={sessionInfo.title}
          onChange={(e) =>
            setSessionInfo({ ...sessionInfo, title: e.target.value })
          }
          className="border"
        />
        <textarea
          placeholder="description"
          value={sessionInfo.description}
          onChange={(e) =>
            setSessionInfo({ ...sessionInfo, description: e.target.value })
          }
          className="border"
        />
        <button type="submit" className="bg-blue-200">
          submit
        </button>
      </form>
      <div>{JSON.stringify(userProfile)}</div>
    </div>
  );
}
