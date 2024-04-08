import type { UserInfo } from "@particle-network/auth";
import type { BrowserProvider, JsonRpcSigner } from "ethers";

export interface User {
  uuid: string;
  email?: string;
  name?: string;
  created_at?: Date;
  address: string;
}

export type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  getUserInfo: () => Promise<UserInfo | null> | null;
  ethers: BrowserProvider | null;
  ethersSigner: () => Promise<JsonRpcSigner | null> | null;
  login: () => Promise<UserInfo | null>;
  logout: () => Promise<void>;
};
