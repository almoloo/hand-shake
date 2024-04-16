"use client";

import type { PushAPI as PushAPIType } from "@pushprotocol/restapi";
import { CONSTANTS, PushAPI } from "@pushprotocol/restapi";
import React, { createContext, useState } from "react";
import { PushContextType } from "@/app/lib/definitions";
import { ethers } from "ethers";

export const PushContext = createContext<PushContextType | null>(null);

export default function PushProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initPushUser = async () => {
    const signer = await new ethers.BrowserProvider(
      window.ethereum!
    ).getSigner();
    const env = process.env.NEXT_PUBLIC_TESTNET
      ? CONSTANTS.ENV.STAGING
      : CONSTANTS.ENV.PROD;
    const pushUser = await PushAPI.initialize(signer, {
      env,
    });
    setPushInfo({ ...pushInfo, pushUser });
    return pushUser;
  };
  const [pushInfo, setPushInfo] = useState<PushContextType>({
    pushUser: null,
    pushInit: initPushUser,
  });

  return (
    <PushContext.Provider value={pushInfo}>{children}</PushContext.Provider>
  );
}
