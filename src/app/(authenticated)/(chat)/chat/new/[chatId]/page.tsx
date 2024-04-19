"use client";

import { fetchSession } from "@/app/lib/data";
import { PushContext } from "@/app/ui/layout/PushProvider";
import { useContext, useEffect, useState } from "react";

export default function page({ params }: { params: { chatId: string } }) {
  const push = useContext(PushContext);
  const [chatInfo, setChatInfo] = useState<any>(null);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    const fetchChatInfo = async () => {
      const response = await fetchSession(params.chatId);
      setChatInfo(response);
    };
    fetchChatInfo();
  }, [params.chatId]);

  const initUser = async () => {
    try {
      await push?.pushInit();
      const joined = await push?.pushUser?.chat.group.info(params.chatId);
      // push?.pushUser?.chat.list()
      setTimeout(() => {
        console.log("🚀", joined);
      }, 2000);
    } catch (error) {
      console.error("🌈", error);
    }
  };

  const checkJoinStatus = async () => {
    const groupInfo: any = await push?.pushUser?.chat.group.info(params.chatId);
    console.log("🚀", groupInfo);
    const groupMembers = groupInfo.members.map((member: any) =>
      member.wallet.replace("eip155:", "")
    );
    const isJoined = groupMembers.includes(push?.pushUser?.account);
    console.log("🚀", isJoined);
  };

  const handleJoinChat = async () => {
    const join = await push?.pushUser?.chat.group.join(params.chatId);
    console.log("🚀", join);
  };

  return (
    <div className="flex flex-col items-start">
      page: {params.chatId}
      <div>{JSON.stringify(chatInfo)}</div>
      <button onClick={initUser}>
        INITIALIZE PUSH USER (${push?.pushUser?.account})
      </button>
      <button onClick={checkJoinStatus}>GET GROUP INFO</button>
      <button onClick={handleJoinChat}>JOIN CHAT</button>
      <div>{isJoined ? "joined" : "not joined"}</div>
    </div>
  );
}
