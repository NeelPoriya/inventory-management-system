import { Metadata } from "next";
import OrderListWrapper from "../inward/components/OrderListWrapper";
import AddOrderDialog from "../inward/components/AddOrderDialog";
import OrderList from "../inward/components/OrderList";

export const metadata: Metadata = {
  title: "Outgoing",
  description: "Outgoing page",
};

export default async function OutgoingPage() {
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <OrderListWrapper>
        <div className="w-full p-2 flex justify-between">
          <div>
            <h1 className="text-2xl font-bold">Outward</h1>
          </div>
          <div>
            <AddOrderDialog orderType="outward" />
          </div>
        </div>
        <OrderList orderType="outward" />
      </OrderListWrapper>
    </div>
  );
}
