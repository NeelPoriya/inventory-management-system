import { Badge } from "@/types/Badge";
import { get } from "../request";

export const getBadge: () => Promise<Badge[]> = async () => {
  const data = await get("/api/info/badge?pageSize=10000");
  return data.items as Badge[];
};
