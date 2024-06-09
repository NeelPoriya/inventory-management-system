import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, queryClient } from "@/lib/utils";

import { Trash, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useContext, useState } from "react";
import { Order } from "@/types/Order";
import { Data } from "@/types/FormattedOrder";
import { useTheme } from "next-themes";

const refresh = () => {
  queryClient.invalidateQueries({
    queryKey: ["dashboard-order"],
  });
};

function DeleteItem({ item }: { item: Order }) {
  const [loading, setLoading] = useState(false);

  const deleteItem = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/info/order/${item._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error deleting item");
      }

      toast.success("Item deleted successfully");
      refresh();
    } catch (error) {
      console.error(error);
      toast.error("Error deleting item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="rounded-full">
        <Button
          size="icon"
          disabled={loading}
          className="bg-red-500 text-white rounded-full hover:bg-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete item and
            remove your data from servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteItem}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ListItemOld({ item }: { item: Order }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex gap-4 items-baseline">
            <div className="flex flex-col gap-1">
              <span>{item.productvariant?.product?.name}</span>
              <span className="text-sm">({item.productvariant?.name})</span>
            </div>
            <Badge
              className="text-primary"
              style={{ backgroundColor: item.badge?.color }}
            >
              {item.badge?.name}
            </Badge>
          </div>
        </CardTitle>
        <CardDescription>
          <div className="flex flex-row items-center justify-between">
            <div>{item.client?.name}</div>
            <div className="flex gap-8 items-center">
              <div>
                <span className={cn("text-xl font-semibold text-green-400")}>
                  {item.quantity}
                </span>
              </div>
              <DeleteItem item={item} />
            </div>
          </div>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

function ListItemNew({ item }: { item: Order }) {
  const theme = useTheme();

  return (
    <div className="border border-blue-200 group rounded-lg py-4 px-4 group relative hover:bg-muted">
      <div className="flex justify-between group-hover:text-primary">
        <div>
          <div className="text-lg font-semibold">
            {item.productvariant?.product?.name}
          </div>
          <div className="text-sm">{item.productvariant?.name}</div>
          <div className="mt-2 flex items-center justify-start">
            <Badge
              className="text-primary"
              style={{ backgroundColor: item.badge?.color }}
            >
              {item.badge?.name}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <span
              className={cn(
                "text-xl font-semibold group-hover:hidden text-green-500"
              )}
            >
              {item.quantity}
            </span>
          </div>
        </div>
      </div>

      <div className="hidden group-hover:block absolute bottom-1/3 right-2">
        <DeleteItem item={item} />
      </div>
    </div>
  );
}

export default function OrderItem({ item }: { item: Data }) {
  console.log(item);
  const date = new Date(item._id);
  const day = date.getUTCDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex gap-4 items-baseline">
            <div className="flex flex-col gap-1">
              <span>{`${day} ${month} ${year}`}</span>
              <span className="text-sm">
                {item.items.length} item{item.items.length > 1 && "s"}
              </span>
            </div>
          </div>
        </CardTitle>
        <CardDescription>
          <div className="grid grid-cols-4 gap-4">
            {item.items.map((i) => {
              return <ListItemNew item={i} key={i._id} />;
            })}
          </div>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
