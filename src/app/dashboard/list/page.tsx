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
        <div className="w-full flex gap-2 justify-between">
          <h1 className="text-xl font-semibold uppercase">List</h1>
          <Button variant={"ghost"}>Download</Button>
        </div>
        <div>
          <ListTable />
        </div>
      </QueryClientWrapper>
    </div>
  );
}
