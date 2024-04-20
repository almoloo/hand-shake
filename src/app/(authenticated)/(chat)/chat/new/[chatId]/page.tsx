"use client";

import Loading from "@/app/(authenticated)/loading";
import { fetchProfile, fetchSession } from "@/app/lib/data";
import { PushContext } from "@/app/ui/layout/PushProvider";
import ProfileCard from "@/app/ui/profile/ProfileCard";
import { Button } from "@/components/ui/button";
import { LoaderIcon, MailCheckIcon, ShieldAlertIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export default function page({ params }: { params: { chatId: string } }) {
  const router = useRouter();
  const push = useContext(PushContext);
  const [loading, setLoading] = useState(true);
  const [loadingGroup, setLoadingGroup] = useState(true);
  const [loadingJoin, setLoadingJoin] = useState(false);
  const [chatInfo, setChatInfo] = useState<any>(null);
  const [groupInfo, setGroupInfo] = useState<any>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    const fetchChatInfo = async () => {
      const response = await fetchSession(params.chatId);
      setChatInfo(response);
      setLoading(false);
    };
    fetchChatInfo();
  }, [params.chatId]);

  useEffect(() => {
    const getGroupInfo = async () => {
      const group: any = await push?.pushUser?.chat.group.info(params.chatId);
      setGroupInfo(group);
    };
    if (chatInfo && push?.pushUser && !groupInfo) {
      setLoadingGroup(true);
      getGroupInfo();
    } else if (!push?.pushUser) {
      setLoadingGroup(false);
    }
  }, [chatInfo, push]);

  useEffect(() => {
    const getMembers = async () => {
      const groupMembers = groupInfo.members.map((member: any) =>
        member.wallet.replace("eip155:", "")
      );
      const isJoined = groupMembers.includes(push?.pushUser?.account);
      setIsJoined(isJoined);
      const adminUser = groupInfo.members.find(
        (member: any) => member.isAdmin === true
      );
      const adminInfo = await fetchProfile(
        adminUser.wallet.replace("eip155:", "")
      );
      setAdmin(adminInfo);
      setLoadingGroup(false);
    };
    if (groupInfo) {
      getMembers();
    }
  }, [groupInfo]);

  useEffect(() => {
    if (isJoined) {
      router.push(`/chat/${params.chatId}`);
    }
  }, [isJoined]);

  const handleJoinChat = async () => {
    setLoadingJoin(true);
    try {
      const join = await push?.pushUser?.chat.group.join(params.chatId);
      if (join) {
        toast.success("Successfully joined chat");
        router.push(`/chat/${params.chatId}`);
      }
    } catch (error) {
      toast.error("Failed to join chat");
      console.error(error);
    } finally {
      setLoadingJoin(false);
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <>
      {!push?.pushUser ? (
        <section className="mt-7 flex flex-col items-center justify-center rounded-lg border px-7 py-14">
          <ShieldAlertIcon className="mb-5 h-14 w-14 text-rose-500" />
          <h1 className="mb-2 text-lg font-semibold text-rose-500">
            You are not authorized to view this chat invitation!
          </h1>
          <p className="text-sm text-rose-400">
            Initialize your push user to view and accept this chat request.
          </p>
        </section>
      ) : (
        <>
          {loadingGroup ? (
            <Loading />
          ) : (
            <main className="my-7 flex grid-cols-8 flex-col lg:grid">
              <section className="col-start-3 col-end-7 space-y-5">
                <h2 className="text-center text-xl font-bold">
                  You've been invited to join a chat session
                </h2>
                <div className="rounded-lg border p-5">
                  <h1 className="mb-2 text-sm font-medium">{chatInfo.title}</h1>
                  <p>{chatInfo.description}</p>
                </div>
                {admin && (
                  <ProfileCard
                    address={admin.user.address}
                    name={admin.name}
                    bio={admin.bio}
                    email={admin.email}
                  />
                )}
                <div className="flex items-center justify-center rounded-lg border border-emerald-900/50 bg-emerald-300/10 px-5 py-10">
                  <Button variant="default" onClick={handleJoinChat}>
                    {loadingJoin ? (
                      <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <MailCheckIcon className="mr-2 h-4 w-4" />
                    )}
                    Join Chat Session
                  </Button>
                </div>
              </section>
            </main>
          )}
        </>
      )}
      {/* <div>Admin: {JSON.stringify(admin)}</div> */}
    </>
    // <div className="flex flex-col items-start">
    //   <div>loading: {loading ? "loading" : "loaded"}</div>
    //   <div>chatID: {params.chatId}</div>
    //   <div>Chat info: {JSON.stringify(chatInfo)}</div>
    //   <div>Group info: {JSON.stringify(groupInfo)}</div>
    //   <div>{isJoined ? "joined" : "not joined"}</div>
    //   <button onClick={handleJoinChat}>JOIN CHAT</button>
    //   <div>{isJoined ? "joined" : "not joined"}</div>
    // </div>
  );
}
