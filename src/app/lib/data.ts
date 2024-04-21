"use server";

import lighthouse from "@lighthouse-web3/sdk";
const bls = require("bls-eth-wasm");

// ----- FETCH ALL PROFILES FROM LIGHTHOUSE -----
export const fetchAllFiles = async () => {
  try {
    const response = await lighthouse.getUploads(
      process.env.LIGHTHOUSE_API_KEY!
    );
    // const response = await axios.get(
    //   "https://api.lighthouse.storage/api/user/files_uploaded",
    //   {
    //     headers: {
    //       Authorization: `Bearer ${process.env.LIGHTHOUSE_API_KEY}`,
    //     },
    //   }
    // );
    return response;
  } catch (error) {
    console.error(error);
  }
};

// ----- FETCH PROFILE FROM LIGHTHOUSE -----
export const fetchProfile = async (uuid: string) => {
  if (!uuid) return null;
  try {
    const allProfiles = await fetchAllFiles();
    const filteredProfiles = allProfiles?.data.fileList.filter(
      (profile: any) => profile.fileName == `PROFILE-${uuid.toLowerCase()}`
    );
    if (!filteredProfiles?.length) {
      return null;
    }
    const profileFile = filteredProfiles?.sort(
      (a: any, b: any) => b.lastUpdate - a.lastUpdate
    )[0];
    const profileCID = profileFile?.cid;
    const profile = await fetch(
      `https://gateway.lighthouse.storage/ipfs/${profileCID}`
    );
    return profile.json();
  } catch (error) {
    console.error(error);
  }
};

// ----- FETCH ALL SESSIONS -----
export const fetchUserSessions = async (uuid: string) => {
  try {
    const allSessions = await fetchAllFiles();
    const userSessions = allSessions?.data.fileList.filter(
      (sessions: any) => sessions.fileName === `SESSIONS-${uuid}`
    );
    if (!userSessions?.length) {
      return [];
    }
    const latestSessions = userSessions.sort(
      (a: any, b: any) => b.lastUpdate - a.lastUpdate
    )[0];
    const sessionsCID = latestSessions.cid;
    const sessions = await fetch(
      `https://gateway.lighthouse.storage/ipfs/${sessionsCID}`
    );
    return sessions.json();
  } catch (error) {
    console.error(error);
  }
};

// ----- FETCH SESSION BY CHATID -----
export const fetchSession = async (chatId: string) => {
  try {
    const allSessions = await fetchAllFiles();
    const sessionList = allSessions?.data.fileList.filter(
      (session: any) => session.fileName === `SESSION-${chatId}`
    );
    if (!sessionList?.length) {
      return null;
    }
    const sessionCID = sessionList[0].cid;
    const session = await fetch(
      `https://gateway.lighthouse.storage/ipfs/${sessionCID}`
    );
    return session.json();
  } catch (error) {
    console.error(error);
  }
};
