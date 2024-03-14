import { Client } from "@/types/Client";

export const getClients: () => Promise<Client[]> = async () => {
  const res = await fetch(`/api/info/client?pageSize=10000`);

  if (!res.ok) {
    throw new Error("Failed to fetch data from server");
  }

  const data = await res.json();
  return data.items as Client[];
};
