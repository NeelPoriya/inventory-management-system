import { Account } from "./Account";

export type Product = {
  _id: string;
  name: string;
  description: string;
  account_id: Account;
  createdAt: string;
  updatedAt: string;
};
