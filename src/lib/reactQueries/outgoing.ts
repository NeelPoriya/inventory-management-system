import { FormattedOutgoing } from "@/types/FormattedOutgoing";

export const getFormattedOutgoing: ({
  pageParam,
}: {
  pageParam: number;
}) => Promise<{ items: FormattedOutgoing }> = async ({ pageParam }) => {
  const res = await fetch(
    `/api/unrest/formatted/outgoing?pageIndex=${pageParam}&pageSize=10`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data from server");
  }

  return res.json();
};
