"use server";

import axios from "axios";
import lighthouse from "@lighthouse-web3/sdk";

export const fetchUserInfo = async (uuid: string, token: string) => {
  // FETCH USER FROM ENDPOINT WITH BASIC AUTH
  const endpoint = `https://api.particle.network/server/rpc`;
  const response = await axios.post(
    endpoint,
    {
      jsonrpc: "2.0",
      id: 0,
      method: "getUserInfo",
      params: [uuid, token],
    },
    {
      auth: {
        username: process.env.NEXT_PUBLIC_PARTICLE_PROJECT_ID!,
        password: process.env.PARTICLE_SERVER_KEY!,
      },
    }
  );
  return response.data;
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
    const filteredProfiles = allProfiles?.data.fileList.filter(
      (profile) => profile.fileName === `PROFILE-${uuid}`
    );
    if (!filteredProfiles?.length) {
      return null;
    }
    const profileFile = filteredProfiles?.sort(
      (a, b) => b.lastUpdate - a.lastUpdate
    )[0];
    const profileCID = profileFile?.cid;
    const profile = await axios.get(
      `https://gateway.lighthouse.storage/ipfs/${profileCID}`
    );
    return profile.data;
  } catch (error) {
    console.error(error);
  }
};
