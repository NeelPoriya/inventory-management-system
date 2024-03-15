"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getFormattedOutgoing } from "@/lib/reactQueries/outgoing";
import { Data } from "@/types/FormattedOutgoing";
import InfiniteScroll from "react-infinite-scroll-component";
import OutgoingItem from "./OutgoingItem";
import { useContext } from "react";
import { RefreshContext } from "@/context/refreshContext";
import { AuthenticationError } from "@/lib/errors/auth";
import { useRouter } from "next/navigation";

export default function OutgoingList() {
  const { value: refresh } = useContext(RefreshContext);
  const router = useRouter();
  const { data, fetchNextPage, hasNextPage, isLoading, error } =
    useInfiniteQuery({
      queryKey: ["outgoing", refresh],
      queryFn: getFormattedOutgoing,
      getNextPageParam: (lastPage) => {
        if (
          !lastPage ||
          !lastPage.items.metadata ||
          !lastPage.items.metadata[0]
        )
          return null;
        if (!lastPage.items.metadata[0].next) return null;

        const nextPage = lastPage.items.metadata[0].pageIndex + 1;
        return nextPage;
      },
      initialPageParam: 0,
    });

  const allItems = data?.pages.reduce(
    (acc, page) => [...acc, ...page.items.data],
    [] as Data[]
  );

  if (error) {
    if (error instanceof AuthenticationError) {
      router.push("/auth/sign-in");
      return <div>{"You are not authorized to view this page"}</div>;
    }
    return <div>{error.message}</div>;
  }

  if (isLoading) {
    return <div>{"Loading..."}</div>;
  }

  return (
    <InfiniteScroll
      dataLength={allItems?.length || 0}
      next={fetchNextPage}
      hasMore={hasNextPage || false}
      loader={<h4>{"Loading..."}</h4>}
    >
      <div className="flex flex-col gap-4">
        {allItems?.map((item) => (
          <OutgoingItem key={item._id} item={item} />
        ))}
        {allItems?.length === 0 && (
          <div className="flex justify-center items-center mt-4">
            {"No Items found!"}
          </div>
        )}
      </div>
    </InfiniteScroll>
  );
}
