"use server";

import lighthouse from "@lighthouse-web3/sdk";
import { UserProfile } from "@/app/lib/definitions";

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
