import { Account } from "./Account";

export type Client = {
  _id: string;
  name: string;
  description?: string;
  registration_address?: string;
  billing_address?: string;
  gst_no?: string;

  account_id: string;
  account?: Account;

  createdAt?: string;
  updatedAt?: string;
};
