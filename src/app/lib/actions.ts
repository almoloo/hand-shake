"use server";

import lighthouse from "@lighthouse-web3/sdk";
import {
  InitSessionInfo,
  SessionInfo,
  UserProfile,
} from "@/app/lib/definitions";
import { Resend } from "resend";
import { fetchUserSessions } from "./data";

const resend = new Resend(process.env.RESEND_API_KEY!);

// ----- SAVE PROFILE TO LIGHTHOUSE -----
export const saveProfile = async (profileInfo: UserProfile) => {
  try {
    const response = await lighthouse.uploadText(
      JSON.stringify(profileInfo),
      process.env.LIGHTHOUSE_API_KEY!,
      `PROFILE-${profileInfo.user.uuid}`
    );
    return response;
  } catch (error) {
    console.error(error);
  }
};

// ----- SEND INVITATION EMAIL -----
export const sendInvitationEmail = async (
  sessionInfo: SessionInfo,
  user: UserProfile
) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Handshake <send@handshake.placeholder.rest>",
      to: sessionInfo.to,
      subject: "Handshake - You have been invited to join a chat session!",
      html: `<div>
				<div>
					<a href="${process.env.NEXT_PUBLIC_URL}/newchat/${sessionInfo.chatId}">
						Accept invitation
					</a>
				</div>
				<div>
				FROM:
				</div>
				<div>${user.name}</div>
				<div>${user.email}</div>
				<div>${user.bio}</div>
				<div>${user.user.address}</div>
				<div>${user.user.uuid}</div>
				<div>
				TO:
				</div>
				<div>${sessionInfo.to}</div>
				<div>${sessionInfo.title}</div>
				<div>${sessionInfo.description}</div>
				<div>${sessionInfo.chatId}</div>
				<div></div>
			</div>`,
    });

    console.log("⚡️ email data", data);

    if (error) {
      throw new Error("Failed to send email");
    }
    return data;
  } catch (error) {
    console.error(error);
  }
};

// ----- REQUEST NEW CHAT SESSION -----
export const requestNewChat = async (
  from: UserProfile,
  info: InitSessionInfo,
  chatId: string
) => {
  try {
    const sessionInfo = {
      from: from.user.uuid,
      to: info.email,
      title: info.title,
      description: info.description,
      chatId: chatId,
      CID: "",
    };
    const uploadedSession = await lighthouse.uploadText(
      JSON.stringify(sessionInfo),
      process.env.LIGHTHOUSE_API_KEY!,
      `SESSION-${chatId}`
    );
    sessionInfo.CID = uploadedSession.data.Hash;
    const sentEmail = await sendInvitationEmail(sessionInfo, from);
    const isSessionSaved = saveSession(sessionInfo, from.user.uuid);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// ----- SAVE USER SESSIONS -----
export const saveSession = async (sessionInfo: SessionInfo, uuid: string) => {
  try {
    const userSessions = await fetchUserSessions(uuid);
    userSessions.unshift(sessionInfo);
    await lighthouse.uploadText(
      JSON.stringify(userSessions),
      process.env.LIGHTHOUSE_API_KEY!,
      `SESSIONS-${uuid}`
    );
    return true;
  } catch (error) {
    console.error(error);
  }
};
