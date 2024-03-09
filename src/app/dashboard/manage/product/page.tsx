"use client";

import { Product } from "@/types/Product";
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
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus } from "lucide-react";
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

const getColumns = (refresh: () => void): ColumnDef<Product>[] => {
  const columns: ColumnDef<Product>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
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
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => (
        <div className="capitalize">
          {new Date(row.getValue("createdAt")).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: ({ row }) => (
        <div className="capitalize">
          {new Date(row.getValue("updatedAt")).toLocaleString()}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original;

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
                onClick={() => navigator.clipboard.writeText(product._id)}
              >
                Copy Product ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DialogItem
                triggerChildren="Edit Product"
                item={product}
                refresh={refresh}
              >
                <DialogTitle className="DialogTitle">Edit Product</DialogTitle>
                <DialogDescription className="DialogDescription">
                  Edit product details
                </DialogDescription>
              </DialogItem>

              <DropdownMenuItem
                onClick={async () => {
                  try {
                    const response = await fetch(
                      `/api/info/product/${product._id}`,
                      {
                        method: "DELETE",
                      }
                    );
                    if (!response.ok) {
                      throw new Error("Failed to delete product");
                    }
                    refresh();
                    toast.success("Product deleted successfully");
                  } catch (error: any) {
                    console.error(error);
                    toast.error(`${error.message}`);
                  }
                }}
              >
                Delete Product
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
  const {
    triggerChildren,
    children,
    refresh,
    onSelect,
    onOpenChange,
    item,
    ...itemProps
  } = props;

  const [product, setProduct] = useState<Product>(item);

  return (
    <Dialog onOpenChange={onOpenChange}>
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
                const response = await fetch(`/api/info/product/${item._id}`, {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    name: product.name,
                    description: product.description,
                  }),
                });
                if (!response.ok) {
                  throw new Error("Failed to update product");
                }
                refresh();
                toast.success("Product updated successfully");
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
                value={product.name}
                onChange={(event) =>
                  setProduct((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={product.description}
                onChange={(event) =>
                  setProduct((prev) => ({
                    ...prev,
                    description: event.target.value,
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

const AddProductDialog = React.forwardRef((props: any, forwardedRef) => {
  const { triggerChildren, children, refresh, ...itemProps } = props;

  const [productDetails, setProductDetails] = useState<
    Pick<Product, "name" | "description">
  >({
    name: "",
    description: "",
  });

  return (
    <Dialog>
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
                const response = await fetch("/api/info/product", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    name: productDetails.name,
                    description: productDetails.description,
                  }),
                });
                if (!response.ok) {
                  throw new Error("Failed to add product");
                }
                refresh();
                // reset all fields
                setProductDetails({
                  name: "",
                  description: "",
                });
                toast.success("Product added successfully");
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
                value={productDetails.name}
                onChange={(event) =>
                  setProductDetails((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={productDetails.description}
                onChange={(event) =>
                  setProductDetails((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
              />
            </div>

            <DialogFooter className="items-center justify-center">
              <Button type="submit">Add Product</Button>
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
AddProductDialog.displayName = "AddProductDialog";

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
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
    pageIndex: 1,
    pageSize: 5,
  });
  const [fetchAgain, setFetchAgain] = useState(false);

  const columns = getColumns(() => {
    setFetchAgain((prev) => !prev);
  });

  const table = useReactTable({
    data: products,
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/info/product?pageSize=10000");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data.items);
      } catch (error: any) {
        console.error(error);
      }
    };

    fetchProducts();
  }, [fetchAgain]);

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
            <AddProductDialog
              triggerChildren={
                <>
                  <Plus className="h-4 w-4" />
                  <span>Add Product</span>
                </>
              }
              refresh={() => setFetchAgain((prev) => !prev)}
            >
              <DialogTitle className="DialogTitle">Add Product</DialogTitle>
              <DialogDescription className="DialogDescription">
                Add a new product
              </DialogDescription>
            </AddProductDialog>
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
