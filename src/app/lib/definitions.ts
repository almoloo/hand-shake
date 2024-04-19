import type { PushAPI as PushAPIType } from "@pushprotocol/restapi";

export interface User {
  uuid: string;
  address: string;
}

export type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  connect: () => Promise<string | null>;
  disconnect: () => Promise<void>;
};

export interface UserProfile {
  user: User;
  name: string;
  email: string;
  bio: string;
}

export interface PushContextType {
  pushUser: PushAPIType | null;
  pushInit: () => Promise<PushAPIType | null>;
}

export interface InitSessionInfo {
  email: string;
  title: string;
  description: string;
}

export interface SessionInfo {
  from: string;
  to: string;
  title: string;
  description: string;
  chatId: string;
  CID: string;
}
