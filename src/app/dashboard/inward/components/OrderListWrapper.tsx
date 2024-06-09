"use client";
import { queryClient } from "@/lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function OrderListWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [refresh, setRefresh] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
