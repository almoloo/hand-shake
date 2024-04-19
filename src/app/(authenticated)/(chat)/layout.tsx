"use client";
import { PushContext } from "@/app/ui/layout/PushProvider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  LoaderIcon,
  MessageSquareWarning,
  UserRoundPlusIcon,
} from "lucide-react";
import React, { useContext, useState } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const push = useContext(PushContext);
  const [loadingPush, setLoadingPush] = useState(false);

  const initPushUser = async () => {
    setLoadingPush(true);
    try {
      await push?.pushInit();
    } catch (error) {
      console.error("🌈", error);
    } finally {
      setLoadingPush(false);
    }
  };

  return (
    <>
      {!push?.pushUser && (
        <Alert variant="default" className="my-5 bg-rose-200/10">
          <MessageSquareWarning className="h-4 w-4" />
          <AlertTitle>Push user not initialized</AlertTitle>
          <AlertDescription>
            You need to initialize the push user before you can use the chat
            feature. You're going to need to do this after each page refresh.
          </AlertDescription>
          <Button
            className="ml-7 mt-5 flex items-center"
            variant="destructive"
            disabled={loadingPush}
            onClick={initPushUser}
          >
            {loadingPush ? (
              <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UserRoundPlusIcon className="mr-2 h-4 w-4" />
            )}
            Initialize Push User
          </Button>
        </Alert>
      )}
      {children}
    </>
  );
}
