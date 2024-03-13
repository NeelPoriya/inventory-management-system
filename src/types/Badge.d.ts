import { Account } from "./Account";

export type Badge = {
  _id: string;
  name: string;
  description: string;
  color: string;
  createdAt?: string;
  updatedAt?: string;
  account_id?: Account;
};
