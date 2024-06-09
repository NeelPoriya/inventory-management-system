"use client";

import { Client } from "@/types/Client";
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
import { Cross2Icon } from "@radix-ui/react-icons";
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
import { getClients } from "@/lib/reactQueries/client";
import { Textarea } from "@/components/ui/textarea";
import { queryClient } from "@/lib/utils";

// a constant which stores key value pairs of some beautiful colors
const colors = {
  "Amaranth Pink": "#D991BA",
  Olive: "#8CAE68",
  "Tomatic Tangerine": "#F19C79",
  cyan: "#00FFFF",
  magenta: "#FF00FF",
};

const refresh = () => {
  queryClient.invalidateQueries({
    queryKey: ["dashboard-manage-client"],
  });
};

const getColumns = (): ColumnDef<Client>[] => {
  const columns: ColumnDef<Client>[] = [
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
      accessorKey: "billing_address",
      header: "Billing Address",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("billing_address")}</div>
      ),
    },
    {
      accessorKey: "gst_no",
      header: "GST No",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("gst_no")}</div>
      ),
    },
    {
      accessorKey: "registration_address",
      header: "Registration Address",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("registration_address")}</div>
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
        const client = row.original;

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
                onClick={() => navigator.clipboard.writeText(client._id)}
              >
                Copy Client ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DialogItem
                triggerChildren="Edit Client"
                item={client}
                refresh={refresh}
              >
                <DialogTitle className="DialogTitle">Edit Client</DialogTitle>
                <DialogDescription className="DialogDescription">
                  Edit client details
                </DialogDescription>
              </DialogItem>

              <DropdownMenuItem
                onClick={async () => {
                  try {
                    const response = await fetch(
                      `/api/info/client/${client._id}`,
                      {
                        method: "DELETE",
                      }
                    );
                    if (!response.ok) {
                      throw new Error("Failed to delete client");
                    }
                    refresh();
                    toast.success("Client deleted successfully");
                  } catch (error: any) {
                    console.error(error);
                    toast.error(`${error.message}`);
                  }
                }}
              >
                Delete Client
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

  const [clientDetails, setClientDetails] = useState<Client>(item);
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
                const response = await fetch(`/api/info/client/${item._id}`, {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    name: clientDetails.name,
                    description: clientDetails.description,
                    billing_address: clientDetails.billing_address,
                    gst_no: clientDetails.gst_no,
                    registration_address: clientDetails.registration_address,
                  }),
                });
                if (!response.ok) {
                  throw new Error("Failed to update client");
                }
                refresh();
                toast.success("Client updated successfully");
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
                value={clientDetails.name}
                onChange={(event) =>
                  setClientDetails((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={clientDetails.description}
                onChange={(event) =>
                  setClientDetails((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label>Billing Address</Label>
              <Textarea
                value={clientDetails.billing_address}
                onChange={(event) =>
                  setClientDetails((prev) => ({
                    ...prev,
                    billing_address: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label>GST No</Label>
              <Input
                value={clientDetails.gst_no}
                onChange={(event) =>
                  setClientDetails((prev) => ({
                    ...prev,
                    gst_no: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label>Registration Address</Label>
              <Textarea
                value={clientDetails.registration_address}
                onChange={(event) =>
                  setClientDetails((prev) => ({
                    ...prev,
                    registration_address: event.target.value,
                  }))
                }
              />
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

const AddClientDialog = React.forwardRef((props: any, forwardedRef) => {
  const { triggerChildren, children, refresh, ...itemProps } = props;

  const [clientDetails, setClientDetails] = useState<
    Pick<
      Client,
      | "name"
      | "description"
      | "billing_address"
      | "gst_no"
      | "registration_address"
    >
  >({
    name: "",
    description: "",
    billing_address: "",
    gst_no: "",
    registration_address: "",
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
                const response = await fetch("/api/info/client", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    name: clientDetails.name,
                    description: clientDetails.description,
                    billing_address: clientDetails.billing_address,
                    gst_no: clientDetails.gst_no,
                    registration_address: clientDetails.registration_address,
                  }),
                });
                if (!response.ok) {
                  throw new Error("Failed to add client");
                }
                refresh();
                // reset all fields
                setClientDetails({
                  name: "",
                  description: "",
                });
                toast.success("Client added successfully");
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
                value={clientDetails.name}
                onChange={(event) =>
                  setClientDetails((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={clientDetails.description}
                onChange={(event) =>
                  setClientDetails((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label>Billing Address</Label>
              <Textarea
                value={clientDetails.billing_address}
                onChange={(event) =>
                  setClientDetails((prev) => ({
                    ...prev,
                    billing_address: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label>GST No</Label>
              <Input
                value={clientDetails.gst_no}
                onChange={(event) =>
                  setClientDetails((prev) => ({
                    ...prev,
                    gst_no: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label>Registration Address</Label>
              <Textarea
                value={clientDetails.registration_address}
                onChange={(event) =>
                  setClientDetails((prev) => ({
                    ...prev,
                    registration_address: event.target.value,
                  }))
                }
              />
            </div>

            <DialogFooter className="items-center justify-center">
              <Button type="submit">Add Client</Button>
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
AddClientDialog.displayName = "AddClientDialog";

export default function ClientPage() {
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

  const columns = getColumns();

  const {
    data: clients,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboard-manage-client"],
    queryFn: getClients,
  });

  const table = useReactTable({
    data: clients || [],
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
      refresh();
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
            <AddClientDialog
              triggerChildren={
                <>
                  <Plus className="h-4 w-4" />
                  <span>Add Client</span>
                </>
              }
              refresh={refresh}
            >
              <DialogTitle className="DialogTitle">Add Client</DialogTitle>
              <DialogDescription className="DialogDescription">
                Add a new client
              </DialogDescription>
            </AddClientDialog>
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
