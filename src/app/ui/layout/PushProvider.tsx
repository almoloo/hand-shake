"use client";

import type { PushAPI as PushAPIType } from "@pushprotocol/restapi";
import { CONSTANTS, PushAPI, SignerType } from "@pushprotocol/restapi";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "@/app/ui/layout/AuthProvider";
import { PushContextType } from "@/app/lib/definitions";
import type { ethers } from "ethers";

export const PushContext = createContext<PushContextType | null>(null);

export default function PushProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useContext(AuthContext);

  const initPushUser = async () => {
    const signer = await auth?.ethers?.getSigner(auth.user?.address!);
    const env = process.env.NEXT_PUBLIC_TESTNET
      ? CONSTANTS.ENV.STAGING
      : CONSTANTS.ENV.PROD;
    console.log("✨ signer", signer);
    const pushUser = await PushAPI.initialize(signer, {
      env,
    });
    console.log("🪁", pushUser);
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
