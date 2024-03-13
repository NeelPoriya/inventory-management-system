"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getFormattedIncoming } from "@/lib/reactQueries/incoming";
import { Data } from "@/types/FormattedIncoming";
import InfiniteScroll from "react-infinite-scroll-component";
import IncomingItem from "./IncomingItem";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AccordionItem } from "@radix-ui/react-accordion";
import { useContext, useState } from "react";
import { RefreshContext } from "@/context/refreshContext";

export default function IncomingList() {
  const { value: refresh } = useContext(RefreshContext);

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["incoming", refresh],
    queryFn: getFormattedIncoming,
    getNextPageParam: (lastPage) => {
      console.log("Initial lastPage:", lastPage);
      if (!lastPage || !lastPage.items.metadata || !lastPage.items.metadata[0])
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
          <IncomingItem key={item._id} item={item} />
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
