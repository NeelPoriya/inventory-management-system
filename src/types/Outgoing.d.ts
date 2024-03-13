import { Account } from "./Account";
import { Badge } from "./Badge";
import { Client } from "./Client";
import { ProductVariant } from "./ProductVariant";

export type Outgoing = {
  date: Date;
  product_variant_id: ProductVariant;
  badge_id: Badge;
  client_id: Client;
  updatedAt: string;
  createdAt: string;
  quantity: number;
  account_id: Account;
};
