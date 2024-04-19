"use client";

import { PushContext } from "@/app/ui/layout/PushProvider";
import { useContext, useState } from "react";

export default function page({ params }: { params: { chatId: string } }) {
  const push = useContext(PushContext);
  const [message, setMessage] = useState("");

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

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const sentMessage = await push?.pushUser?.chat.send(params.chatId, {
      type: "Text",
      content: message,
    });

    console.log("🏈", sentMessage);
  };

  const getChats = async () => {
    const chats = await push?.pushUser?.chat.history(params.chatId);
    console.log("🚀", chats);
  };
  return (
    <div>
      <div>page: {params.chatId}</div>
      <button onClick={initUser}>
        INITIALIZE PUSH USER (${push?.pushUser?.account})
      </button>
      <form onSubmit={handleSendMessage}>
        <textarea
          className="border"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <button type="submit">Send</button>
      </form>
      <div>
        <button onClick={getChats}>GET ALL CHATS</button>
      </div>
    </div>
  );
}
