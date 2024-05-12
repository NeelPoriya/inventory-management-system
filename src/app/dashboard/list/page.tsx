"use client";
import { Button } from "@/components/ui/button";
import QueryClientWrapper from "../manage/components/query-client-wrapper";
import ListTable from "./components/list-table";
import { ColumnDef } from "@tanstack/react-table";
import { Order } from "@/types/Order";

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "product_variant_id",
    header: "Name",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("product_variant_id")}</div>
    ),
  },
];

export default function ListPage() {
  return (
    <div className="m-4 p-8">
      <QueryClientWrapper>
        <ListTable />
      </QueryClientWrapper>
    </div>
  );
}
