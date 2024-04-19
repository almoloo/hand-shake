"use client";

import Loading from "@/app/(authenticated)/loading";
import { fetchProfile } from "@/app/lib/data";
import Heading from "@/app/ui/components/Heading";
import { AuthContext } from "@/app/ui/layout/AuthProvider";
import { PushContext } from "@/app/ui/layout/PushProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import clsx from "clsx";
import {
  HourglassIcon,
  MessageSquareTextIcon,
  ShieldAlertIcon,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export default function page({ params }: { params: { chatId: string } }) {
  const push = useContext(PushContext);
  const auth = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [groupInfo, setGroupInfo] = useState<any>(null);
  const [groupUsers, setGroupUsers] = useState<any>([]);

  useEffect(() => {
    const init = async () => {
      try {
        const group: any = await push?.pushUser?.chat.group.info(params.chatId);
        if (!group?.members?.includes(auth?.user?.address)) {
          group?.members.forEach(async (member: any) => {
            const user = await fetchProfile(
              member.wallet.replace("eip155:", "")
            );
            setGroupUsers([...groupUsers, user]);
          });
          setGroupInfo(group);
        }
        setLoading(false);
      } catch (error) {
        console.error("🌈", error);
      }
    };
    if (params.chatId && !groupInfo) {
      setLoading(true);
      init();
    }
  }, [push]);

  useEffect(() => {
    const getChats = async () => {
      const chats = await push?.pushUser?.chat.history(params.chatId);
      if (chats) {
        setMessages(chats);
      }
      setLoadingMessages(false);
    };
    if (groupInfo) {
      setLoadingMessages(true);
      getChats();
    }
  }, [groupInfo]);

  const refreshMessages = async () => {
    setLoadingMessages(true);
    try {
      const chats = await push?.pushUser?.chat.history(params.chatId);
      if (chats) {
        setMessages(chats);
      }
    } catch (error) {
      toast.error("Failed to fetch messages");
      console.error(error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const sentMessage = await push?.pushUser?.chat.send(params.chatId, {
        type: "Text",
        content: message,
      });
    } catch (error) {
      toast.error("Failed to send message");
      console.error(error);
    } finally {
      setSubmitLoading(false);
      setMessage("");
      refreshMessages();
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <>
      {groupInfo ? (
        <main className="flex grid-cols-3 flex-col space-x-10 lg:grid">
          <section className="col-span-2">
            <Heading
              title={`Chat Session: ${groupInfo?.groupName}`}
              description={groupInfo?.groupDescription}
              icon={<MessageSquareTextIcon className="h-6 w-6" />}
            />
            <div>
              {loadingMessages ? (
                <div className="mt-7 flex flex-col items-center justify-center px-7 py-14">
                  <Loading />
                </div>
              ) : groupInfo.members.length > 1 ? (
                <>
                  <div className="flex flex-col space-y-5">
                    {messages.length > 0
                      ? messages.map((msg, idx) => (
                          <div
                            key={idx}
                            className={clsx("p-2 rounded-lg", {
                              "bg-blue-700 text-white":
                                msg.fromDID.replace("eip155:", "") ===
                                auth?.user?.address,
                              "bg-neutral-200 text-black":
                                msg.fromDID.replace("eip155:", "") !==
                                auth?.user?.address,
                            })}
                          >
                            <small className="mb-1 block font-medium">
                              {msg.fromDID.replace("eip155:", "")}
                            </small>
                            <p>{msg.messageContent}</p>
                          </div>
                        ))
                      : "No messages yet"}
                  </div>
                  <form className="mt-5" onSubmit={handleSubmit}>
                    <fieldset>
                      <div className="flex space-x-2">
                        <Input
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Type your message here..."
                          disabled={submitLoading}
                          required
                        />
                        <Button type="submit" disabled={submitLoading}>
                          Send
                        </Button>
                      </div>
                    </fieldset>
                  </form>
                </>
              ) : (
                <div className="mt-7 flex flex-col items-center justify-center rounded-lg border px-7 py-14">
                  <HourglassIcon className="mb-5 h-14 w-14 animate-spin text-neutral-500" />
                  <h1 className="mb-2 text-lg font-semibold text-neutral-500">
                    Waiting for the other party to join the chat session.
                  </h1>
                  <p className="text-sm text-neutral-400">
                    You can only view and contribute to this chat session once
                    the other party joins.
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>
      ) : (
        <section className="mt-7 flex flex-col items-center justify-center rounded-lg border px-7 py-14">
          <ShieldAlertIcon className="mb-5 h-14 w-14 text-rose-500" />
          <h1 className="mb-2 text-lg font-semibold text-rose-500">
            You are not authorized to view this chat session!
          </h1>
          {!push?.pushUser && (
            <p className="text-sm text-rose-400">
              Initialize your push user to view and contribute to this chat
              session.
            </p>
          )}
        </section>
      )}
    </>
    // <div>
    //   <div>page: {params.chatId}</div>
    //   <button onClick={initUser}>
    //     INITIALIZE PUSH USER (${push?.pushUser?.account})
    //   </button>
    //   <form onSubmit={handleSendMessage}>
    //     <textarea
    //       className="border"
    //       value={message}
    //       onChange={(e) => setMessage(e.target.value)}
    //     ></textarea>
    //     <button type="submit">Send</button>
    //   </form>
    //   <div>
    //     <button onClick={getChats}>GET ALL CHATS</button>
    //   </div>
    // </div>
  );
}
