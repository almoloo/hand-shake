"use server";

import lighthouse from "@lighthouse-web3/sdk";
import { UserProfile } from "@/app/lib/definitions";

// ----- SAVE PROFILE TO LIGHTHOUSE -----
export const saveProfile = async (profileInfo: UserProfile) => {
  try {
    const response = await lighthouse.uploadText(
      JSON.stringify(profileInfo),
      process.env.LIGHTHOUSE_API_KEY!,
      profileInfo.user.uuid
    );
    return response;
  } catch (error) {
    console.error(error);
  }
};

// ----- UPLOAD PROFILE IMAGE TO LIGHTHOUSE -----
export const uploadProfileImage = async (file: File, uuid: string) => {
  try {
    const response = await lighthouse.upload(
      file,
      process.env.LIGHTHOUSE_API_KEY!
    );
    return response.data.Hash;
  } catch (error) {
    console.error(error);
  }
};
