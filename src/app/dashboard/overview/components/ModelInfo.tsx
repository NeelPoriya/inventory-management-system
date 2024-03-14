"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getBadge } from "@/lib/reactQueries/badge";
import { getClients } from "@/lib/reactQueries/client";
import { getProductVariants } from "@/lib/reactQueries/productvariant";
import { Badge } from "@/types/Badge";
import { Client } from "@/types/Client";
import { ProductVariant } from "@/types/ProductVariant";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import MultiSelect from "./MultiSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

type ModelInfoProps = {
  name: string;
  apiName: string;
  badges: Badge[] | undefined;
  clients: Client[] | undefined;
  productvariants: ProductVariant[] | undefined;
  color: string;
};

export default function ModelInfo(props: ModelInfoProps) {
  const { badges, clients, productvariants, name, apiName, color } = props;

  const [selectedBadges, setSelectedBadges] = useState<Badge[]>([]);
  const [selectedClients, setSelectedClients] = useState<Client[]>([]);
  const [selectedProductVariants, setSelectedProductVariants] = useState<
    ProductVariant[]
  >([]);
  const [quantity, setQuantity] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/unrest/formatted/${apiName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          badgeIds:
            selectedBadges.length === 0
              ? undefined
              : selectedBadges.map((badge) => badge._id),
          clientIds:
            selectedClients.length === 0
              ? undefined
              : selectedClients.map((client) => client._id),
          productVariantIds:
            selectedProductVariants.length === 0
              ? undefined
              : selectedProductVariants.map(
                  (productvariant) => productvariant._id
                ),
        }),
      });

      if (!response.ok) {
        throw new Error("Error searching incoming info");
      }

      const data = await response.json();
      setQuantity(data?.items[0]?.totalQuantity || null);
    } catch (error) {
      console.error(error);
      toast.error("Error searching incoming info");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <MultiSelect
          label="Badges"
          options={
            badges?.map((badge) => ({
              value: badge._id,
              label: badge.name,
            })) || []
          }
          value={selectedBadges.map((badge) => badge._id)}
          onChange={(value) => {
            const badgeIds = value;
            const items =
              badges?.filter((badge) => badgeIds.includes(badge._id)) || [];

            setSelectedBadges(items);
          }}
          key={"badges"}
        />
        <MultiSelect
          label="Clients"
          options={
            clients?.map((client) => ({
              value: client._id,
              label: client.name,
            })) || []
          }
          value={selectedClients.map((client) => client._id)}
          onChange={(value) => {
            const clientIds = value;
            const items =
              clients?.filter((client) => clientIds.includes(client._id)) || [];

            setSelectedClients(items);
          }}
          key={"clients"}
        />
        <MultiSelect
          label="Product Variants"
          options={
            productvariants?.map((productvariant) => ({
              value: productvariant._id,
              label:
                productvariant.name + " - " + productvariant.product_id?.name,
            })) || []
          }
          value={selectedProductVariants.map(
            (productvariant) => productvariant._id
          )}
          onChange={(value) => {
            const productvariantIds = value;
            const items =
              productvariants?.filter((productvariant) =>
                productvariantIds.includes(productvariant._id)
              ) || [];

            setSelectedProductVariants(items);
          }}
          key={"product-variants"}
        />
        <Button onClick={handleSearch}>Search</Button>
        <CardFooter className="p-2">
          <div className="flex flex-row gap-2 items-center text-lg">
            <h3>Result: </h3>
            {isLoading ? (
              <Loader size={15} className="animate-spin" />
            ) : (
              <span className={cn("font-bold", color)}>
                {quantity || "N/A"}
              </span>
            )}
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
