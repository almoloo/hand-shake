"use client";

import Loading from "@/app/(authenticated)/loading";
import { fetchProfile } from "@/app/lib/data";
import Heading from "@/app/ui/components/Heading";
import { AuthContext } from "@/app/ui/layout/AuthProvider";
import { PushContext } from "@/app/ui/layout/PushProvider";
import ProfileCard from "@/app/ui/profile/ProfileCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import clsx from "clsx";
import {
  FilePenIcon,
  HourglassIcon,
  LoaderIcon,
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
  const [loadingSign, setLoadingSign] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [sortedMessages, setSortedMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [groupInfo, setGroupInfo] = useState<any>(null);
  const [groupUsers, setGroupUsers] = useState<any>([]);

  let refreshInterval: any = null;

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
      refreshInterval = setInterval(() => {
        refreshMessages();
      }, 10000);
    };
    if (groupInfo) {
      setLoadingMessages(true);
      getChats();
    }
  }, [groupInfo]);

  useEffect(() => {
    if (messages) {
      const sorted = messages.sort((a, b) => a.timestamp - b.timestamp);
      setSortedMessages(sorted);
    }
  }, [messages]);

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

  const handleSignChat = async () => {
    setLoadingSign(true);
    setLoading(true);
  };

  return loading ? (
    <Loading />
  ) : (
    <>
      {groupInfo ? (
        <main className="flex grow grid-cols-3 flex-col space-x-10 lg:grid">
          <section className="col-span-2 flex grow flex-col">
            <Heading
              title={`Chat Session: ${groupInfo?.groupName}`}
              description={groupInfo?.groupDescription}
              icon={<MessageSquareTextIcon className="h-6 w-6" />}
            />
            <div className="flex grow flex-col">
              {loadingMessages ? (
                <div className="mt-7 flex flex-col items-center justify-center px-7 py-14">
                  <Loading />
                </div>
              ) : groupInfo.members.length > 1 ? (
                <>
                  <div className="flex grow flex-col space-y-5">
                    {sortedMessages.length > 0 ? (
                      sortedMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={clsx(
                            "flex flex-col space-y-1 p-2 rounded-lg w-3/4",
                            {
                              "bg-blue-500 text-white self-start":
                                msg.fromDID
                                  .replace("eip155:", "")
                                  .toLowerCase() === auth?.user?.address,
                              "bg-neutral-200 text-black self-end":
                                msg.fromDID
                                  .replace("eip155:", "")
                                  .toLowerCase() !== auth?.user?.address,
                            }
                          )}
                        >
                          <small className="block overflow-hidden text-ellipsis whitespace-nowrap font-medium">
                            (
                            {msg.fromDID
                              .replace("eip155:", "")
                              .toLowerCase() === auth?.user?.address
                              ? "You"
                              : groupUsers.find(
                                  (user: any) =>
                                    user.wallet ===
                                    msg.fromDID.replace("eip155:", "")
                                )?.name ?? "Unknown User"}
                            ){" "}
                            <span className="opacity-70">
                              {msg.fromDID.replace("eip155:", "")}
                            </span>
                          </small>
                          <p>{msg.messageContent}</p>
                          <small className="block self-end text-xs">
                            {new Date(msg.timestamp).toLocaleString()}
                          </small>
                        </div>
                      ))
                    ) : (
                      <div className="my-7 rounded-lg border bg-neutral-400/15 px-7 py-14">
                        There are no messages in this chat session.
                      </div>
                    )}
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
          <section className="col-span-1">
            <Heading title="Members` Information" className="text-center" />
            {groupUsers.map(
              (user: any, idx: number) =>
                user && (
                  <ProfileCard
                    key={idx}
                    address={user.user.address}
                    bio={user.bio}
                    email={user.email}
                    name={user.name}
                  />
                )
            )}
            <div className="mt-5 border-t pt-5">
              <AlertDialog>
                <AlertDialogTrigger className="w-full">
                  <Button variant="destructive" className="w-full">
                    Sign and Close Chat Session
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Sign and Close Chat Session
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to sign this chat session?
                      <br />
                      By signing, you will close the chat session and prevent
                      any further messages from being sent.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={loadingSign}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      disabled={loadingSign}
                      onClick={handleSignChat}
                    >
                      {loadingSign ? (
                        <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <FilePenIcon className="mr-2 h-4 w-4" />
                      )}
                      Proceed
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
