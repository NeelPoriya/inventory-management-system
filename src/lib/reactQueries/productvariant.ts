import { ProductVariant } from "@/types/ProductVariant";
import { get } from "../request";

export const getProductVariants: () => Promise<ProductVariant[]> = async () => {
  const data = await get("/api/info/productvariant?pageSize=10000");
  return data.items as ProductVariant[];
};
