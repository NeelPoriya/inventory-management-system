"use client";

import { RefreshContext } from "@/context/refreshContext";
import { queryClient } from "@/lib/utils";
import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function DashboardCardsWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [refresh, setRefresh] = useState<boolean>(false);
  return (
    <QueryClientProvider client={queryClient}>
      <RefreshContext.Provider
        value={{
          value: refresh,
          toggle: () => {
            setRefresh((prev) => !prev);
          },
        }}
      >
        {children}
      </RefreshContext.Provider>
    </QueryClientProvider>
  );
}
