import type { UserInfo } from "@particle-network/auth";
import type { BrowserProvider, JsonRpcSigner } from "ethers";
import type { PushAPI as PushAPIType } from "@pushprotocol/restapi";

export interface User {
  uuid: string;
  address: string;
}

export type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  getUserInfo: () => Promise<UserInfo | null> | null;
  ethers: BrowserProvider | null;
  ethersSigner: () => Promise<JsonRpcSigner> | null;
  login: () => Promise<UserInfo | null>;
  logout: () => Promise<void>;
};

export interface UserProfile {
  user: User;
  name: string;
  email: string;
  bio: string;
}

export interface PushContextType {
  pushUser: PushAPIType | null;
  pushInit: () => Promise<PushAPIType>;
}

export interface InitSessionInfo {
  email: string;
  title: string;
  description: string;
}
