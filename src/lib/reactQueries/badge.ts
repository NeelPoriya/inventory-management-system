import { Badge } from "@/types/Badge";

export const getBadge: () => Promise<Badge[]> = async () => {
  const res = await fetch(`/api/info/badge?pageSize=10000`);

  if (!res.ok) {
    throw new Error("Failed to fetch data from server");
  }

  const data = await res.json();
  return data.items as Badge[];
};
