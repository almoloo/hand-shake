"use server";

import lighthouse from "@lighthouse-web3/sdk";
import { UserProfile } from "@/app/lib/definitions";
import { Resend } from "resend";

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
  email: string,
  user: UserProfile,
  sessionId: string
) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Handshake <send@handshake.placeholder.rest>",
      to: email,
      subject: "Handshake - You have been invited to join a chat session!",
      text: `<div>
				<div>
					<a href="${process.env.NEXT_PUBLIC_SITE_URL}/newchat/${sessionId}">
						Accept invitation
					</a>
				</div>
				<div>${user.name}</div>
				<div>${user.email}</div>
				<div>${user.bio}</div>
				<div>${user.user.address}</div>
			</div>`,
    });

    if (error) {
      throw new Error("Failed to send email");
    }
    return data;
  } catch (error) {
    console.error(error);
  }
};
