import { Product } from "@/types/Product";

export const getProducts: () => Promise<Product[]> = async () => {
  const res = await fetch(`/api/info/product?pageSize=10000`);

  if (!res.ok) {
    throw new Error("Failed to fetch data from server");
  }

  const data = await res.json();
  return data.items as Product[];
};
