"use client";

import { PushContext } from "@/app/ui/layout/PushProvider";
import { useContext, useEffect, useState } from "react";
import Loading from "@/app/(authenticated)/loading";
import { toast } from "sonner";
import { ArrowUpDownIcon, ShieldAlertIcon } from "lucide-react";
import Link from "next/link";

export default function page() {
  const push = useContext(PushContext);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    const fetchSessions = async () => {
      try {
        const response = await push?.pushUser?.chat.list("CHATS");
        const formattedResponse = response?.map((session: any) => ({
          chatId: session.chatId,
          title: session.groupInformation.groupName,
          description: session.groupInformation.groupDescription,
          members: session.groupInformation.members.map((member: any) => ({
            address: member.wallet.replace("eip155:", ""),
          })),
        }));
        setSessions(formattedResponse ?? []);
        console.log(response);
      } catch (error) {
        toast.error("Failed to fetch sessions");
        console.error("🌈", error);
      } finally {
        setSessionsLoading(false);
      }
    };
    if (push?.pushUser) {
      setSessionsLoading(true);
      fetchSessions();
    }
  }, [push]);

  return loading ? (
    <Loading />
  ) : (
    <>
      {!push?.pushUser ? (
        <section className="mt-7 flex flex-col items-center justify-center rounded-lg border px-7 py-14">
          <ShieldAlertIcon className="mb-5 h-14 w-14 text-rose-500" />
          <h1 className="mb-2 text-lg font-semibold text-rose-500">
            You are not authorized to view chat history!
          </h1>
          <p className="text-sm text-rose-400">
            Initialize your push user to view past chat sessions.
          </p>
        </section>
      ) : (
        <>
          {sessionsLoading ? (
            <Loading />
          ) : (
            <main className="my-7 flex grid-cols-3 flex-col space-y-5 lg:grid">
              {sessions.map((session) => (
                <Link
                  className="col-span-2 flex flex-col rounded-lg border transition-colors hover:bg-neutral-100 lg:flex-row"
                  key={session.chatId}
                  href={`/chat/${session.chatId}`}
                >
                  <div className="border-r p-5 lg:w-2/3">
                    <h2 className="mb-2 text-base font-bold">
                      {session.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-neutral-500">
                      {session.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-between p-5 lg:w-1/3">
                    <small className="font-medium">
                      {session.members[0].address.slice(0, 10)}...
                      {session.members[0].address.slice(-6)}
                    </small>
                    {session.members.length > 1 && (
                      <>
                        <ArrowUpDownIcon className="h-4 w-4 text-neutral-500" />
                        <small className="font-medium">
                          {session.members[1].address.slice(0, 10)}...
                          {session.members[1].address.slice(-6)}
                        </small>
                      </>
                    )}
                  </div>
                </Link>
              ))}
            </main>
          )}
        </>
      )}
    </>
  );
}
