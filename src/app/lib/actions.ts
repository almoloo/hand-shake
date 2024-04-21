"use server";

const bls = require("bls-eth-wasm");
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
      html: `
			<style>
				.text-center {
					text-align: center;
				}
				.title {
					font-size: 1.5rem;
					line-height: 2rem;
					color: #1e1b4b;
				}
				.subtitle {
					font-size: 1rem;
					color: #333;
				}
				.box {
					margin-top: 1rem;
					padding: 1rem;
					border: 1px solid #ccc;
					border-radius: 0.5rem;
				}
				.profile {
					padding: 0;
					border: 1px solid #ccc;
				}
				.bio {
					margin: 1rem 0;
					font-size: 0.8rem;
					color: #666;
				}
				.button {
					background-color: #4c1d95;
					color: #fff;
					padding: 0.5rem 2rem;
					border-radius: 0.5rem;
					text-decoration: none;
				}
			</style>
			<div class="text-center">
				<h1 class="title">Handshake</h1>
				<p class="subtitle">You have been invited to join a chat session.</p>
			</div>
			<div class="profile box">
				<p>
					You have been invited by ${user.name}.
					<blockquote class="bio">${user.bio}</blockquote>
					<a href="mailto:${user.email}">${user.email}</a>
					Wallet address: ${user.user.address}
				</p>
			</div>
			<div class="box">
				<a class="button" href="${process.env.NEXT_PUBLIC_URL}/chat/new/${sessionInfo.chatId}">
					Accept invitation
				</a>
			</div>
			`,
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
    const isSessionSaved = await saveSession(sessionInfo, from.user.uuid);
    return sessionInfo;
  } catch (error) {
    console.error(error);
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
