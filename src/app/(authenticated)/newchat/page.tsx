"use client";

import { requestNewChat, sendInvitationEmail } from "@/app/lib/actions";
import { InitSessionInfo } from "@/app/lib/definitions";
import { AuthContext } from "@/app/ui/layout/AuthProvider";
import { ProfileContext } from "@/app/ui/layout/ProfileProvider";
import { PushContext } from "@/app/ui/layout/PushProvider";
import { PushAPI } from "@pushprotocol/restapi";
import { useContext, useEffect, useState } from "react";

export default function page() {
  // const auth = useContext(AuthContext);
  const push = useContext(PushContext);
  const userProfile = useContext(ProfileContext);
  const [sessionInfo, setSessionInfo] = useState<InitSessionInfo>({
    title: "",
    description: "",
    email: "",
  });
  const [pushUser, setPushUser] = useState<PushAPI | null>(null);

  useEffect(() => {
    if (push?.pushUser) {
      console.log("💀🪃", push.pushUser);
      setPushUser(push.pushUser);
    }
  }, [push?.pushUser]);

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

  const initUser = async () => {
    try {
      await push?.pushInit();
    } catch (error) {
      console.error("🌈", error);
    }
  };
  return (
    <div>
      new chat
      <div>
        <button onClick={initUser}>INITIALIZE PUSH USER</button>
      </div>
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
      <div>{pushUser?.account}</div>
    </div>
  );
}
