"use client";

import { fetchUserSessions } from "@/app/lib/data";
import { SessionInfo } from "@/app/lib/definitions";
import { ProfileContext } from "@/app/ui/layout/ProfileProvider";
import { useContext, useEffect, useState } from "react";

export default function page() {
  const userProfile = useContext(ProfileContext);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetchUserSessions(userProfile?.user.uuid!);
        setSessions(response);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSessions();
  }, []);

  return (
    <div>
      {loading && <div>Loading...</div>}
      {!loading &&
        sessions.map((session) => (
          <div key={session.chatId}>
            <div>{session.to}</div>
            <div>{session.title}</div>
            <div>{session.description}</div>
            <div>{session.chatId}</div>
            <div>{session.CID}</div>
            <div></div>
          </div>
        ))}
    </div>
  );
}
