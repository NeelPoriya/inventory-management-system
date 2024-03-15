"use client";

import { Badge } from "@/types/Badge";
import React, { useEffect, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUpDown,
  ChevronDown,
  Loader,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getBadge } from "@/lib/reactQueries/badge";

// a constant which stores key value pairs of some beautiful colors
const colors = {
  Blue: "#007bff",
  Red: "#dc3545",
  Green: "#28a745",
  Yellow: "#ffc107",
  Purple: "#6f42c1",
  Orange: "#fd7e14",
  Cyan: "#17a2b8",
  Pink: "#e83e8c",
  Teal: "#20c997",
  Indigo: "#6610f2",
  Lime: "#d4edda",
  Brown: "#856404",
};

const getColumns = (refresh: () => void): ColumnDef<Badge>[] => {
  const columns: ColumnDef<Badge>[] = [
    // {
    //   id: "select",
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && "indeterminate")
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("description")}</div>
      ),
    },
    {
      accessorKey: "color",
      header: "Color",
      cell: ({ row }) => (
        <div
          className="w-max px-2 rounded-full"
          style={{ backgroundColor: row.getValue("color") }}
        >
          <span>{"Badge"}</span>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => (
        <div className="capitalize">
          {new Date(row.getValue("createdAt")).toDateString()}
        </div>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: ({ row }) => (
        <div className="capitalize">
          {new Date(row.getValue("updatedAt")).toDateString()}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const badge = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(badge._id)}
              >
                Copy Badge ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DialogItem
                triggerChildren="Edit Badge"
                item={badge}
                refresh={refresh}
              >
                <DialogTitle className="DialogTitle">Edit Badge</DialogTitle>
                <DialogDescription className="DialogDescription">
                  Edit badge details
                </DialogDescription>
              </DialogItem>

              <DropdownMenuItem
                onClick={async () => {
                  try {
                    const response = await fetch(
                      `/api/info/badge/${badge._id}`,
                      {
                        method: "DELETE",
                      }
                    );
                    if (!response.ok) {
                      throw new Error("Failed to delete badge");
                    }
                    refresh();
                    toast.success("Badge deleted successfully");
                  } catch (error: any) {
                    console.error(error);
                    toast.error(`${error.message}`);
                  }
                }}
              >
                Delete Badge
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return columns;
};

const DialogItem = React.forwardRef((props: any, forwardedRef) => {
  const { triggerChildren, children, refresh, onSelect, item, ...itemProps } =
    props;

  const [badgeDetails, setBadgeDetails] = useState<Badge>(item);
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          {...itemProps}
          ref={forwardedRef}
          className="DropdownMenuItem"
          onSelect={(event) => {
            event.preventDefault();
            onSelect && onSelect();
          }}
        >
          {triggerChildren}
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="DialogOverlay" />
        <DialogContent className="DialogContent">
          {children}
          <form
            action={async () => {
              try {
                const response = await fetch(`/api/info/badge/${item._id}`, {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    name: badgeDetails.name,
                    description: badgeDetails.description,
                    color: badgeDetails.color,
                  }),
                });
                if (!response.ok) {
                  throw new Error("Failed to update badge");
                }
                refresh();
                toast.success("Badge updated successfully");
                setOpen(false);
              } catch (error: any) {
                console.error(error);
                toast.error(`${error.message}`);
              }
            }}
            className="flex flex-col gap-2"
          >
            <div>
              <Label>Name</Label>
              <Input
                value={badgeDetails.name}
                onChange={(event) =>
                  setBadgeDetails((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={badgeDetails.description}
                onChange={(event) =>
                  setBadgeDetails((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label>Color</Label>
              <Select
                onValueChange={(value) =>
                  setBadgeDetails((prev) => ({
                    ...prev,
                    color: value,
                  }))
                }
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Colors</SelectLabel>
                    {Object.entries(colors).map(([color, value]) => (
                      <SelectItem key={color} value={value}>
                        <div className="flex gap-2">
                          <div
                            className="w-max rounded-full px-2"
                            style={{ backgroundColor: value }}
                          >
                            <span>
                              {color[0].toUpperCase() + color.substring(1)}
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="items-center justify-center">
              <Button type="submit">Save Changes</Button>
              {/* <DialogClose asChild>
              <Button variant="outline" className="mt-4">
              <Cross2Icon className="h-4 w-4" />
              <span className="ml-2">Close</span>
              </Button>
            </DialogClose> */}
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
});
DialogItem.displayName = "DialogItem";

const AddBadgeDialog = React.forwardRef((props: any, forwardedRef) => {
  const { triggerChildren, children, refresh, ...itemProps } = props;

  const [badgeDetails, setBadgeDetails] = useState<
    Pick<Badge, "name" | "description" | "color">
  >({
    name: "",
    description: "",
    color: "",
  });

  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button {...itemProps} ref={forwardedRef}>
          {triggerChildren}
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="DialogOverlay" />
        <DialogContent className="DialogContent">
          {children}
          <form
            action={async () => {
              try {
                const response = await fetch("/api/info/badge", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    name: badgeDetails.name,
                    description: badgeDetails.description,
                    color: badgeDetails.color,
                  }),
                });
                if (!response.ok) {
                  throw new Error("Failed to add badge");
                }
                refresh();
                // reset all fields
                setBadgeDetails({
                  name: "",
                  description: "",
                  color: "",
                });
                setOpen(false);
                toast.success("Badge added successfully");
              } catch (error: any) {
                console.error(error);
                toast.error(`${error.message}`);
              }
            }}
            className="flex flex-col gap-2"
          >
            <div>
              <Label>Name</Label>
              <Input
                value={badgeDetails.name}
                onChange={(event) =>
                  setBadgeDetails((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={badgeDetails.description}
                onChange={(event) =>
                  setBadgeDetails((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label>Color</Label>
              <Select
                onValueChange={(value) =>
                  setBadgeDetails((prev) => ({
                    ...prev,
                    color: value,
                  }))
                }
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Colors</SelectLabel>
                    {Object.entries(colors).map(([color, value]) => (
                      <SelectItem key={color} value={value}>
                        <div className="flex gap-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: value }}
                          />
                          <span>
                            {color[0].toUpperCase() + color.substring(1)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="items-center justify-center">
              <Button type="submit">Add Badge</Button>
              {/* <DialogClose asChild>
              <Button variant="outline" className="mt-4">
              <Cross2Icon className="h-4 w-4" />
              <span className="ml-2">Close</span>
              </Button>
            </DialogClose> */}
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
});
AddBadgeDialog.displayName = "AddBadgeDialog";

export default function BadgePage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    select: true,
    name: true,
    description: true,
    color: true,
    createdAt: false,
    updatedAt: false,
    actions: true,
  });
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [fetchAgain, setFetchAgain] = useState(false);

  const columns = getColumns(() => {
    setFetchAgain((prev) => !prev);
  });

  const { data: badges, isLoading } = useQuery({
    queryKey: ["badges", fetchAgain],
    queryFn: getBadge,
  });

  const table = useReactTable({
    data: badges ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onStateChange: (newState) => {
      setFetchAgain((prev) => !prev);
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="w-full">
        <div className="flex items-center py-4 justify-between">
          <Input
            placeholder="Filter name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className="flex gap-4">
            <AddBadgeDialog
              triggerChildren={
                <>
                  <Plus className="h-4 w-4" />
                  <span>Add Badge</span>
                </>
              }
              refresh={() => setFetchAgain((prev) => !prev)}
            >
              <DialogTitle className="DialogTitle">Add Badge</DialogTitle>
              <DialogDescription className="DialogDescription">
                Add a new badge
              </DialogDescription>
            </AddBadgeDialog>
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
        </div>
        <div className="rounded-md border">
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
    </>
  );
}
