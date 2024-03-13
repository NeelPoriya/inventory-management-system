import { Account } from "./Account";
import { Product } from "./Product";

export type ProductVariant = {
  _id: string;
  name: string;
  description: string;
  price: number;
  product_id?: Product;
  account_id?: Account;
  createdAt?: string;
  updatedAt?: string;
  product?: Product;
};
