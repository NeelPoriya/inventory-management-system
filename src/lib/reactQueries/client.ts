import { Client } from "@/types/Client";
import { get } from "../request";

export const getClients: () => Promise<Client[]> = async () => {
  const data = await get(`/api/info/client?pageSize=10000`);
  return data.items as Client[];
};
