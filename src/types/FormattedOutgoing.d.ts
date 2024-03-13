import { Badge } from "./Badge";
import { Client } from "./Client";
import { ProductVariant } from "./ProductVariant";

export type MetaData = {
  total: number;
  pageIndex: number;
  pageSize: number;
  next: boolean;
  nextUrl: string;
};

export type OutgoingItem = {
  _id: string;
  date: Date;
  product_variant_id: string;
  client_id: string;
  badge_id: string;
  account_id: string;
  createdAt: Date;
  updatedAt: Date;
  badge: Badge;
  productvariant: ProductVariant;
  client: Client;
  quantity: number;
};

export type Data = {
  _id: string;
  items: OutgoingItem[];
};

export type FormattedOutgoing = {
  metadata: MetaData[];
  data: Data[];
};
