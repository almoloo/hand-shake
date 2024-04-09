"use server";

import lighthouse from "@lighthouse-web3/sdk";
import { UserProfile } from "@/app/lib/definitions";
import axios from "axios";

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

// ----- FETCH ALL PROFILES FROM LIGHTHOUSE -----
export const fetchAllProfiles = async () => {
  try {
    const response = await lighthouse.getUploads(
      process.env.LIGHTHOUSE_API_KEY!
    );
    return response;
  } catch (error) {
    console.error(error);
  }
};

// ----- FETCH PROFILE FROM LIGHTHOUSE -----
export const fetchProfile = async (uuid: string) => {
  try {
    const allProfiles = await fetchAllProfiles();
    const profileFile = allProfiles?.data.fileList.findLast(
      (profile) => profile.fileName === uuid
    );
    const profileCID = profileFile?.cid;
    const profile = await axios.get(
      `https://gateway.lighthouse.storage/ipfs/${profileCID}`
    );
    console.log(profile.data);
    return profile.data;
  } catch (error) {
    console.error(error);
  }
};
