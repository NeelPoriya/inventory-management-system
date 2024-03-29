import { Order } from "./Order";

export type MetaData = {
  total: number;
  pageIndex: number;
  pageSize: number;
  next: boolean;
  nextUrl: string;
};

export type Data = {
  _id: string;
  items: Order[];
};

export type FormattedOrder = {
  metadata: MetaData[];
  data: Data[];
};
