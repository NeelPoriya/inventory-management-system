import { ProductVariant } from "@/types/ProductVariant";

export const getProductVariants: () => Promise<ProductVariant[]> = async () => {
  const res = await fetch(`/api/info/productvariant?pageSize=10000`);

  if (!res.ok) {
    throw new Error("Failed to fetch data from server");
  }

  const data = await res.json();
  return data.items as ProductVariant[];
};
