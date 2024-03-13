import { FormattedIncoming } from "@/types/FormattedIncoming";

export const getFormattedIncoming: ({
  pageParam,
}: {
  pageParam: number;
}) => Promise<{ items: FormattedIncoming }> = async ({ pageParam }) => {
  const res = await fetch(
    `/api/unrest/formatted/incoming?pageIndex=${pageParam}&pageSize=10`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data from server");
  }

  return res.json();
};
