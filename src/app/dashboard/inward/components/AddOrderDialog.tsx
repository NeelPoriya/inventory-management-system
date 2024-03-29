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
import { Incoming } from "@/types/Incoming";
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
import { Order } from "@/types/Order";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export default function AddOrderDialog({
  orderType,
}: {
  orderType: "inward" | "outward";
}) {
  const { toggle: refresh } = useContext(RefreshContext);

  const [productsVariants, setProductsVariants] = useState<ProductVariant[]>();
  const [clients, setClients] = useState<Client[]>();
  const [badges, setBadges] = useState<Badge[]>();
  const [open, setOpen] = useState(false);

  const [order, setOrder] = useState<
    Pick<
      Order,
      | "badge_id"
      | "client_id"
      | "product_variant_id"
      | "date"
      | "quantity"
      | "type"
      | "vehicle_no"
      | "driver_name"
      | "contact_number"
      | "transporter"
      | "mode_of_transport"
      | "e_way_bill_no"
      | "site_name"
      | "contact_person"
      | "contact_person_no"
    >
  >({
    badge_id: "",
    client_id: "",
    date: new Date(),
    product_variant_id: "",
    quantity: 0,
    type: orderType,
    vehicle_no: "",
    driver_name: "",
    contact_number: "",
    transporter: "",
    mode_of_transport: "",
    e_way_bill_no: "",
    site_name: "",
    contact_person: "",
    contact_person_no: "",
  });

  const fetchDetails = async () => {
    try {
      const [productsVariants, clients, badges] = await Promise.all([
        fetch("/api/info/productvariant?pageSize=10000").then((res) =>
          res.json()
        ),
        fetch("/api/info/client?pageSize=10000").then((res) => res.json()),
        fetch("/api/info/badge?pageSize=10000").then((res) => res.json()),
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
      // console.log(order);
      const response = await fetch("/api/info/order", {
        method: "POST",
        body: JSON.stringify({
          ...order,
          date: new Date(order.date.getTime() + 330 * 60 * 1000),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Error adding incoming");
      }

      toast.success("Incoming added successfully");
      refresh();

      setOpen(false);
      // reset the form
      setOrder({
        badge_id: "",
        client_id: "",
        date: new Date(),
        product_variant_id: "",
        quantity: 0,
        type: orderType,
        vehicle_no: "",
        driver_name: "",
        contact_number: "",
        transporter: "",
        mode_of_transport: "",
        e_way_bill_no: "",
        site_name: "",
        contact_person: "",
        contact_person_no: "",
      });
    } catch (error) {
      toast.error("Error adding incoming");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <DialogTitle>Add a new Incoming</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Please add details of the new incoming item.
        </DialogDescription>
        <ScrollArea className="h-[400px] rounded-md border p-4 overflow-scroll">
          <form action={handleSubmit}>
            <div className="flex flex-col items-start justify-start gap-2">
              <Label htmlFor="name" className="text-right">
                Date
              </Label>
              <DatePicker
                date={new Date(order?.date || new Date())}
                setDate={(newDate) => {
                  setOrder((prev) => {
                    return { ...prev, date: newDate };
                  });
                }}
              />
              <div className="h-1">&nbsp;</div>
              <Label>Quantity</Label>
              <Input
                type="number"
                value={order?.quantity}
                min={0}
                required={true}
                max={1000000000}
                onChange={(e) =>
                  setOrder((prev) => {
                    return { ...prev, quantity: parseInt(e.target.value) };
                  })
                }
              />
              <div className="h-1">&nbsp;</div>
              <Label>Product Variant</Label>

              <Select
                required={true}
                onValueChange={(value) => {
                  setOrder((prev) => {
                    return {
                      ...prev,
                      product_variant_id: value,
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
                        {productVariant.name} -{" "}
                        {productVariant.product_id?.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <div className="h-1">&nbsp;</div>
              <Label>Clients</Label>
              <Select
                required={true}
                onValueChange={(value) => {
                  setOrder((prev) => {
                    return {
                      ...prev,
                      client_id: value,
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
                required={true}
                onValueChange={(value) => {
                  setOrder((prev) => {
                    return { ...prev, badge_id: value };
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

              <div className="h-1">&nbsp;</div>
              <Label>Vehicle No</Label>
              <Input
                type="text"
                value={order?.vehicle_no}
                onChange={(e) =>
                  setOrder((prev) => {
                    return { ...prev, vehicle_no: e.target.value };
                  })
                }
              />
              <div className="h-1">&nbsp;</div>
              <Label>Driver Name</Label>
              <Input
                type="text"
                value={order?.driver_name}
                onChange={(e) =>
                  setOrder((prev) => {
                    return { ...prev, driver_name: e.target.value };
                  })
                }
              />
              <div className="h-1">&nbsp;</div>
              <Label>Contact Number</Label>
              <Input
                type="text"
                value={order?.contact_number}
                onChange={(e) =>
                  setOrder((prev) => {
                    return { ...prev, contact_number: e.target.value };
                  })
                }
              />
              <div className="h-1">&nbsp;</div>
              <Label>Transporter</Label>
              <Input
                type="text"
                value={order?.transporter}
                onChange={(e) =>
                  setOrder((prev) => {
                    return { ...prev, transporter: e.target.value };
                  })
                }
              />
              <div className="h-1">&nbsp;</div>
              <Label>Mode of Transport</Label>
              <Input
                type="text"
                value={order?.mode_of_transport}
                onChange={(e) =>
                  setOrder((prev) => {
                    return { ...prev, mode_of_transport: e.target.value };
                  })
                }
              />
              <div className="h-1">&nbsp;</div>
              <Label>E-Way Bill No</Label>
              <Input
                type="text"
                value={order?.e_way_bill_no}
                onChange={(e) =>
                  setOrder((prev) => {
                    return { ...prev, e_way_bill_no: e.target.value };
                  })
                }
              />
              <div className="h-1">&nbsp;</div>
              <Label>Site Name</Label>
              <Input
                type="text"
                value={order?.site_name}
                required={true}
                onChange={(e) =>
                  setOrder((prev) => {
                    return { ...prev, site_name: e.target.value };
                  })
                }
              />
              <div className="h-1">&nbsp;</div>
              <Label>Contact Person</Label>
              <Input
                type="text"
                value={order?.contact_person}
                onChange={(e) =>
                  setOrder((prev) => {
                    return { ...prev, contact_person: e.target.value };
                  })
                }
              />
              <div className="h-1">&nbsp;</div>
              <Label>Contact Person No</Label>
              <Input
                type="text"
                value={order?.contact_person_no}
                onChange={(e) =>
                  setOrder((prev) => {
                    return { ...prev, contact_person_no: e.target.value };
                  })
                }
              />
              <div className="h-1">&nbsp;</div>

              <DialogFooter>
                <Button type="submit">Add</Button>
              </DialogFooter>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
