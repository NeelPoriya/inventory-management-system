"use client";
import { queryClient } from "@/lib/utils";
import { QueryClientProvider } from "@tanstack/react-query";

export default function InvoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
