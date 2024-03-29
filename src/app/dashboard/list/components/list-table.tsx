"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllOrders } from "@/lib/reactQueries/order";
import { cn } from "@/lib/utils";
import { Order } from "@/types/Order";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const ColumnFilter = ({ column }: { column: any }) => {
  const { filterValue, setFilter } = column;
  return (
    <Input
      value={filterValue || ""}
      onChange={(e) => setFilter(e.target.value)}
      placeholder={`Filter ${column.id}`}
    />
  );
};

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ getValue }) => (
      <div className="min-w-[150px]">
        {new Date(getValue() as string).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: "client.name",
    header: "Client",
    cell: ({ getValue }) => (
      <div className="capitalize min-w-[150px]">{getValue() as string}</div>
    ),
    enableColumnFilter: true,
  },
  {
    accessorKey: "productvariant.name",
    header: "Product Variant",
    cell: ({ getValue }) => (
      <div className="capitalize min-w-[150px]">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "productvariant.product.name",
    header: "Product",
    cell: ({ getValue }) => (
      <div className="capitalize min-w-[150px]">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "badge.name",
    header: "Badge",
    cell: ({ row }) => {
      return (
        <div
          style={{
            backgroundColor: row.original.badge?.color,
          }}
          className="rounded-full text-white uppercase font-semibold w-max px-2"
        >
          {row.original.badge?.name}
        </div>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ getValue, row }) => (
      <div
        className={cn(
          {
            "text-green-500": row.original.type === "inward",
            "text-orange-500": row.original.type === "outward",
          },
          "font-semibold min-w-[150px]"
        )}
      >
        {getValue() as number}
      </div>
    ),
  },

  {
    accessorKey: "type",
    header: "Type",
    cell: ({ getValue }) => (
      <div className="capitalize min-w-[150px]">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "contact_person",
    header: "Contact Person",
    cell: ({ getValue }) => (
      <div className="capitalize min-w-[150px]">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "contact_number",
    header: "Contact Number",
    cell: ({ getValue }) => (
      <div className="capitalize min-w-[150px]">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "driver_name",
    header: "Driver Name",
    cell: ({ getValue }) => (
      <div className="capitalize min-w-[150px]">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "mode_of_transport",
    header: "Mode of Transport",
    cell: ({ getValue }) => (
      <div className="capitalize min-w-[150px]">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "site_name",
    header: "Site Name",
    cell: ({ getValue }) => (
      <div className="capitalize min-w-[150px]">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "transporter",
    header: "Transporter",
    cell: ({ getValue }) => (
      <div className="capitalize min-w-[150px]">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "vehicle_no",
    header: "Vehicle No",
    cell: ({ getValue }) => (
      <div className="capitalize min-w-[150px]">{getValue() as string}</div>
    ),
  },
];

export default function ListTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const { data, isLoading, error } = useQuery({
    queryKey: ["list"],
    queryFn: getAllOrders,
  });

  const table = useReactTable({
    data: data?.items || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (isLoading) return <>Loading...</>;

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border overflow-scroll">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
