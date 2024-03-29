import { FormattedIncoming } from "@/types/FormattedIncoming";
import { FormattedOrder } from "@/types/FormattedOrder";

export const getFormattedOrder: ({
  pageParam,
  orderType,
}: {
  pageParam: number;
  orderType: "inward" | "outward";
}) => Promise<{ items: FormattedOrder }> = async ({ pageParam, orderType }) => {
  const res = await fetch(
    `/api/unrest/formatted/${orderType}?pageIndex=${pageParam}&pageSize=10`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data from server");
  }

  return res.json();
};
