"use client";

import { CONSTANTS, PushAPI } from "@pushprotocol/restapi";
import React, { createContext, useState } from "react";
import { PushContextType } from "@/app/lib/definitions";
import { ethers } from "ethers";
import { toast } from "sonner";

export const PushContext = createContext<PushContextType | null>(null);

export default function PushProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initPushUser = async () => {
    try {
      const signer = await new ethers.providers.Web3Provider(
        window.ethereum as any,
        "any"
      ).getSigner();
      const env = process.env.NEXT_PUBLIC_TESTNET
        ? CONSTANTS.ENV.STAGING
        : CONSTANTS.ENV.PROD;
      const pushUser = await PushAPI.initialize(signer, {
        env,
      });
      setPushInfo({ ...pushInfo, pushUser });
      toast.success("Push user initialized");
      return pushUser;
    } catch (error) {
      toast.error("Failed to initialize push user");
      console.error("🌈", error);
      return null;
    }
  };
  const [pushInfo, setPushInfo] = useState<PushContextType>({
    pushUser: null,
    pushInit: initPushUser,
  });

  return (
    <PushContext.Provider value={pushInfo}>{children}</PushContext.Provider>
  );
}
