import { Order } from "@/types/Order";

type AllOrdersResponse = {
  items: Order[];
  message: string;
  length: number;
};

export const getAllOrders = async (): Promise<AllOrdersResponse> => {
  const res = await fetch(`/api/list/order`);
  if (!res.ok) {
    throw new Error("Failed to fetch data from server");
  }
  return res.json();
};
