"use client";
import { RefreshContext } from "@/context/refreshContext";
import { queryClient } from "@/lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function IncomingListWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [refresh, setRefresh] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <RefreshContext.Provider
        value={{
          toggle: () => {
            setRefresh((prev) => !prev);
          },
          value: refresh,
        }}
      >
        {children}
      </RefreshContext.Provider>
    </QueryClientProvider>
  );
}
