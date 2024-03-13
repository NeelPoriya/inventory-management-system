"use client";
import { Button } from "@/components/ui/button";
import { ProductVariant } from "@/types/ProductVariant";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { Client } from "@/types/Client";
import { Badge } from "@/types/Badge";
import { Outgoing } from "@/types/Outgoing";
import { DatePicker } from "./DatePicker";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshContext } from "@/context/refreshContext";

export default function AddOutgoingDialog() {
  const { toggle: refresh } = useContext(RefreshContext);

  const [productsVariants, setProductsVariants] = useState<ProductVariant[]>();
  const [clients, setClients] = useState<Client[]>();
  const [badges, setBadges] = useState<Badge[]>();

  const [outgoing, setOutgoing] = useState<
    Pick<
      Outgoing,
      "badge_id" | "client_id" | "date" | "product_variant_id" | "quantity"
    >
  >({
    badge_id: {
      _id: "",
      name: "",
      color: "",
      description: "",
    },
    client_id: {
      _id: "",
      name: "",
      description: "",
    },
    date: new Date(),
    product_variant_id: {
      name: "",
      description: "",
      price: 0,
      _id: "",
    },
    quantity: 0,
  });

  const fetchDetails = async () => {
    try {
      const [productsVariants, clients, badges] = await Promise.all([
        fetch("/api/info/productvariant").then((res) => res.json()),
        fetch("/api/info/client").then((res) => res.json()),
        fetch("/api/info/badge").then((res) => res.json()),
      ]);
      setProductsVariants(productsVariants.items);
      setClients(clients.items);
      setBadges(badges.items);
    } catch (error) {
      toast.error("Error fetching details");
      console.error(error);
    }
  };

  const handleSubmit = async (e: any) => {
    try {
      const response = await fetch("/api/info/outgoing", {
        method: "POST",
        body: JSON.stringify(outgoing),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Error adding outgoing");
      }

      toast.success("Outgoing added successfully");
      refresh();
    } catch (error) {
      toast.error("Error adding outgoing");
      console.error(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            fetchDetails();
          }}
        >
          Add
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new Outgoing</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Please add details of the new outgoing item.
        </DialogDescription>
        <form action={handleSubmit}>
          <div className="flex flex-col items-start justify-start gap-2">
            <Label htmlFor="name" className="text-right">
              Date
            </Label>
            <DatePicker
              date={new Date(outgoing?.date || new Date())}
              setDate={(newDate) => {
                setOutgoing((prev) => {
                  return { ...prev, date: newDate };
                });
                return;
              }}
            />
            <div className="h-1">&nbsp;</div>
            <Label>Quantity</Label>
            <Input
              type="number"
              value={outgoing?.quantity}
              min={0}
              max={1000000000}
              onChange={(e) =>
                setOutgoing((prev) => {
                  return { ...prev, quantity: parseInt(e.target.value) };
                })
              }
            />
            <div className="h-1">&nbsp;</div>
            <Label>Product Variant</Label>

            <Select
              onValueChange={(value) => {
                // find the badge by id
                const product_variant = productsVariants?.find(
                  (productvariant) => productvariant._id === value
                );
                setOutgoing((prev) => {
                  return {
                    ...prev,
                    product_variant_id:
                      product_variant || prev.product_variant_id,
                  };
                });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a product variant" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Product Variants</SelectLabel>
                  {productsVariants?.map((productVariant) => (
                    <SelectItem
                      key={productVariant._id}
                      value={productVariant._id}
                    >
                      {productVariant.name} - {productVariant.product_id?.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <div className="h-1">&nbsp;</div>
            <Label>Clients</Label>
            <Select
              onValueChange={(value) => {
                // find the badge by id
                const client = clients?.find((client) => client._id === value);
                setOutgoing((prev) => {
                  return {
                    ...prev,
                    client_id: client || prev.client_id,
                  };
                });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Clients</SelectLabel>
                  {clients?.map((client) => (
                    <SelectItem key={client._id} value={client._id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <div className="h-1">&nbsp;</div>
            <Label>Badge</Label>
            <Select
              onValueChange={(value) => {
                // find the badge by id
                const badge = badges?.find((badge) => badge._id === value);
                setOutgoing((prev) => {
                  return { ...prev, badge_id: badge || prev.badge_id };
                });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a badge" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Badges</SelectLabel>
                  {badges?.map((badge) => (
                    <SelectItem key={badge._id} value={badge._id}>
                      <div className="flex gap-2">
                        <div
                          className="w-max rounded-full px-2"
                          style={{ backgroundColor: badge.color }}
                        >
                          <span>
                            {badge.name[0].toUpperCase() +
                              badge.name.substring(1)}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <DialogFooter>
              <Button type="submit">Add</Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
