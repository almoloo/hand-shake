"use server";

import axios from "axios";

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
