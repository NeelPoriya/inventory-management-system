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
  Column,
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

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
        <div className="min-w-[150px] flex items-center justify-center">
          <div
            style={{
              backgroundColor: row.original.badge?.color,
            }}
            className="rounded-full text-white uppercase font-semibold w-max px-2"
          >
            {row.original.badge?.name}
          </div>
        </div>
      );
    },
    meta: {
      filterVariant: "select",
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
        <div className="w-full flex gap-2 justify-between">
          <h1 className="text-xl font-semibold uppercase">List</h1>
        </div>
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
                      <div className="flex flex-col gap-2 py-2">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} />
                          </div>
                        ) : null}
                      </div>
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

function Filter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue();
  // @ts-ignore
  const { filterVariant } = column.columnDef.meta ?? {};

  const selectValuesWithDuplicates = column
    .getFacetedRowModel()
    .rows.map((row) => row.original.badge?.name);

  // Remove duplicates
  const selectValues = [...new Set(selectValuesWithDuplicates)];

  return filterVariant === "range" ? (
    <div>
      <div className="flex space-x-2">
        {/* See faceted column filters example for min max values functionality */}
        <DebouncedInput
          type="number"
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min`}
          className="w-24 border shadow rounded"
        />
        <DebouncedInput
          type="number"
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max`}
          className="w-24 border shadow rounded"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : filterVariant === "select" ? (
    <Select
      onValueChange={(value) => {
        if (value === "all") {
          column.setFilterValue("");
        } else {
          column.setFilterValue(value);
        }
      }}
      value={columnFilterValue as string}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a badge" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Badges</SelectLabel>
          <SelectItem key={"all"} value={"all"}>
            All
          </SelectItem>
          {selectValues.map((value) => (
            <SelectItem key={value} value={value}>
              {value}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  ) : (
    <DebouncedInput
      className="w-36 border shadow rounded"
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Search...`}
      type="text"
      value={(columnFilterValue ?? "") as string}
    />
    // See faceted column filters example for datalist search suggestions
  );
}

// A typical debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
