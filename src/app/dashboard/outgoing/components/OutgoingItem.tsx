import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Data,
  OutgoingItem as OutgoingItemType,
} from "@/types/FormattedOutgoing";
import { Trash } from "lucide-react";
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
import { useContext } from "react";
import { RefreshContext } from "@/context/refreshContext";

function DeleteItem({ item }: { item: OutgoingItemType }) {
  const { toggle: refresh } = useContext(RefreshContext);

  const deleteItem = async () => {
    try {
      const response = await fetch(`/api/info/outgoing/${item._id}`, {
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
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button className="bg-red-500 text-white rounded-full hover:bg-red-600">
          <Trash size={12} />
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

function ListItem({ item }: { item: OutgoingItemType }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex gap-4 items-baseline">
            <div className="flex flex-col gap-1">
              <span> {item.productvariant.product?.name}</span>
              <span className="text-sm">({item.productvariant.name})</span>
            </div>
            <Badge
              className="text-primary"
              style={{ backgroundColor: item.badge.color }}
            >
              {item.badge.name}
            </Badge>
          </div>
        </CardTitle>
        <CardDescription>
          <div className="flex flex-row items-center justify-between">
            <div>{item.client.name}</div>
            <div className="flex gap-8 items-center">
              <div>
                <span className={cn("text-xl font-semibold text-orange-400")}>
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

export default function OutgoingItem({ item }: { item: Data }) {
  const date = new Date(item._id);
  const day = date.getUTCDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {
            <div className="flex gap-4 items-baseline">
              <div className="flex flex-col gap-1">
                <span>{`${day} ${month} ${year}`}</span>
                <span className="text-sm">
                  {item.items.length} item{item.items.length > 1 && "s"}
                </span>
              </div>
            </div>
          }
        </CardTitle>
        <CardDescription className="flex flex-col gap-2 pt-4">
          {item.items.map((i) => {
            return (
              <div key={i._id}>
                <ListItem item={i} />
              </div>
            );
          })}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
