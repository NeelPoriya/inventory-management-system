import { FormattedOutgoing } from "@/types/FormattedOutgoing";
import { get } from "../request";

export const getFormattedOutgoing: ({
  pageParam,
}: {
  pageParam: number;
}) => Promise<{ items: FormattedOutgoing }> = async ({ pageParam }) => {
  const data = await get(
    `/api/unrest/formatted/outgoing?pageIndex=${pageParam}&pageSize=10`
  );

  return data;
};
