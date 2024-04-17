"use server";

import axios from "axios";
import lighthouse from "@lighthouse-web3/sdk";
import type { PushAPI } from "@pushprotocol/restapi";

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
  try {
    const allProfiles = await fetchAllFiles();
    const filteredProfiles = allProfiles?.data.fileList.filter(
      (profile: any) => profile.fileName === `PROFILE-${uuid}`
    );
    if (!filteredProfiles?.length) {
      return null;
    }
    const profileFile = filteredProfiles?.sort(
      (a: any, b: any) => b.lastUpdate - a.lastUpdate
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
    const sessions = await axios.get(
      `https://gateway.lighthouse.storage/ipfs/${sessionsCID}`
    );
    return sessions.data;
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
    const session = await axios.get(
      `https://gateway.lighthouse.storage/ipfs/${sessionCID}`
    );
    return session.data;
  } catch (error) {
    console.error(error);
  }
};
