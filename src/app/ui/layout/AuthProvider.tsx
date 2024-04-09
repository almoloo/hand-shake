"use client";

import { createContext, useEffect, useState } from "react";
import { ParticleNetwork, WalletEntryPosition } from "@particle-network/auth";
import { ParticleProvider } from "@particle-network/provider";
import { BaseSepolia, Ethereum } from "@particle-network/chains";
import { ethers } from "ethers";
import type { BrowserProvider } from "ethers";
import { AuthContextType, User } from "@/app/lib/definitions";

const selectedNetwork =
  process.env.NEXT_PUBLIC_TESTNET === "true" ? BaseSepolia : Ethereum;

export const particle = new ParticleNetwork({
  projectId: process.env.NEXT_PUBLIC_PARTICLE_PROJECT_ID!,
  clientKey: process.env.NEXT_PUBLIC_PARTICLE_CLIENT_KEY!,
  appId: process.env.NEXT_PUBLIC_PARTICLE_APP_ID!,
  chainName: selectedNetwork.name,
  chainId: selectedNetwork.id,
  wallet: {
    displayWalletEntry: false,
    defaultWalletEntryPosition: WalletEntryPosition.BR,
    uiMode: "light",
    supportChains: [{ id: selectedNetwork.id, name: selectedNetwork.name }],
  },
});

const particleProvider = new ParticleProvider(particle.auth);
let ethersProvider: BrowserProvider | null = null;
ethersProvider = new ethers.BrowserProvider(particleProvider, "any");

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const getUserInfo = async () => {
    try {
      const userInfo = await particle.auth.getUserInfo();
      return userInfo;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleLogin = async () => {
    try {
      const userInfo = await particle.auth.login();
      await connect();
      return userInfo;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleLogout = async () => {
    try {
      await particle.auth.logout();
      await connect();
    } catch (error) {
      console.error(error);
    }
  };

  const connect = async () => {
    if (particle.auth.isLogin()) {
      const userInfo = await particle.auth.getUserInfo();

      if (!userInfo) {
        throw new Error("Failed to get user info");
      }

      const user: User = {
        uuid: userInfo.uuid,
        address: userInfo.wallets[0].public_address,
      };

      setAuthInfo({
        isAuthenticated: true,
        user,
        getUserInfo,
        ethers: ethersProvider,
        ethersSigner: () => ethersProvider?.getSigner() ?? null,
        login: handleLogin,
        logout: handleLogout,
      });
    } else {
      setAuthInfo({
        isAuthenticated: false,
        user: null,
        getUserInfo,
        ethers: ethersProvider,
        ethersSigner: () => ethersProvider?.getSigner() ?? null,
        login: handleLogin,
        logout: handleLogout,
      });
    }
  };

  const [authInfo, setAuthInfo] = useState<AuthContextType | null>({
    isAuthenticated: false,
    user: null,
    getUserInfo,
    ethers: ethersProvider,
    ethersSigner: () => null,
    login: handleLogin,
    logout: handleLogout,
  });

  useEffect(() => {
    connect();
  }, []);

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
}
