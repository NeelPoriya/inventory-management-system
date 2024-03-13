"use client";

import { ProductVariant } from "@/types/ProductVariant";
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
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Product } from "@/types/Product";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const getColumns = (
  refresh: () => void,
  allProducts: Product[]
): ColumnDef<ProductVariant>[] => {
  const columns: ColumnDef<ProductVariant>[] = [
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
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("price")}</div>
      ),
    },
    {
      accessorKey: "product_id",
      header: "Product Name",
      cell: ({ row }) => (
        <div className="capitalize">
          {JSON.parse(JSON.stringify(row.getValue("product_id"))).name}
        </div>
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
        const productvariant = row.original;

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
                onClick={() =>
                  navigator.clipboard.writeText(productvariant._id)
                }
              >
                Copy Product Variant ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DialogItem
                triggerChildren="Edit Product Variant"
                item={productvariant}
                refresh={refresh}
                allProducts={allProducts}
              >
                <DialogTitle className="DialogTitle">
                  Edit Product Variant
                </DialogTitle>
                <DialogDescription className="DialogDescription">
                  Edit product variant details
                </DialogDescription>
              </DialogItem>

              <DropdownMenuItem
                onClick={async () => {
                  try {
                    const response = await fetch(
                      `/api/info/productvariant/${productvariant._id}`,
                      {
                        method: "DELETE",
                      }
                    );
                    if (!response.ok) {
                      throw new Error("Failed to delete product variant");
                    }
                    refresh();
                    toast.success("Product variant deleted successfully");
                  } catch (error: any) {
                    console.error(error);
                    toast.error(`${error.message}`);
                  }
                }}
              >
                Delete Product Variant
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
    allProducts,
    ...itemProps
  } = props;

  const [productvariant, setProductvariant] = useState<ProductVariant>(item);

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
                const response = await fetch(
                  `/api/info/productvariant/${item._id}`,
                  {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      name: productvariant.name,
                      description: productvariant.description,
                      product_id: productvariant.product_id?._id || "",
                    }),
                  }
                );
                if (!response.ok) {
                  throw new Error("Failed to update product variant");
                }
                refresh();
                toast.success("Product variant updated successfully");
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
                value={productvariant.name}
                onChange={(event) =>
                  setProductvariant((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={productvariant.description}
                onChange={(event) =>
                  setProductvariant((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label>Product</Label>
              <Select
                onValueChange={(value) => {
                  const product = allProducts.find(
                    (product: Product) => product._id === value
                  );
                  if (product) {
                    setProductvariant((prev) => ({
                      ...prev,
                      product_id: product,
                    }));
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      productvariant.product_id?.name || "Choose a Product"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {allProducts.map((product: Product) => (
                    <SelectItem key={product._id} value={product._id}>
                      {product.name}
                    </SelectItem>
                  ))}
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

const AddProductDialog = React.forwardRef((props: any, forwardedRef) => {
  const { triggerChildren, children, refresh, products, ...itemProps } = props;

  const [productvariantDetails, setProductvariantDetails] = useState<
    Pick<ProductVariant, "name" | "description" | "price" | "product_id">
  >({
    name: "",
    description: "",
    price: 0,
    product_id: {
      _id: "",
      name: "",
      description: "",
      createdAt: "",
      updatedAt: "",
      account_id: {
        _id: "",
        name: "",
        username: "",
        createdAt: "",
        updatedAt: "",
      },
    },
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
                const response = await fetch("/api/info/productvariant/", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    name: productvariantDetails.name,
                    description: productvariantDetails.description,
                    price: productvariantDetails.price,
                    product_id: productvariantDetails.product_id?._id || "",
                  }),
                });
                if (!response.ok) {
                  throw new Error("Failed to add product");
                }
                refresh();
                toast.success("Product variant added successfully");
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
                value={productvariantDetails.name}
                onChange={(event) =>
                  setProductvariantDetails((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={productvariantDetails.description}
                onChange={(event) =>
                  setProductvariantDetails((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label>Price</Label>
              <Input
                type="number"
                value={productvariantDetails.price}
                onChange={(event) =>
                  setProductvariantDetails((prev) => ({
                    ...prev,
                    price: parseFloat(event.target.value),
                  }))
                }
              />
            </div>
            <div>
              <Label>Product</Label>
              <Select
                onValueChange={(value) => {
                  const product = products.find(
                    (product: Product) => product._id === value
                  );
                  if (product) {
                    setProductvariantDetails((prev) => ({
                      ...prev,
                      product_id: product,
                    }));
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a Product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product: Product) => (
                    <SelectItem key={product._id} value={product._id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="items-center justify-center">
              <Button type="submit">Add Product Variant</Button>
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

export default function ProductVariantPage() {
  const [productvariants, setProductvariants] = useState<ProductVariant[]>([]);
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
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  const columns = getColumns(() => {
    setFetchAgain((prev) => !prev);
  }, allProducts);

  const table = useReactTable({
    data: productvariants,
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
    const fetchProductVariants = async () => {
      try {
        const response = await fetch("/api/info/productvariant?pageSize=10000");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProductvariants(data.items);
      } catch (error: any) {
        console.error(error);
      }
    };

    fetchProductVariants();
  }, [fetchAgain]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/info/product?pageSize=10000");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setAllProducts(data.items);
      } catch (error: any) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

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
              products={allProducts}
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
