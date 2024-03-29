import AddOrderDialog from "./components/AddOrderDialog";
import { Metadata } from "next";
import OrderList from "./components/OrderList";
import OrderListWrapper from "./components/OrderListWrapper";

export const metadata: Metadata = {
  title: "Inward",
  description: "Incoming page",
};

export default async function InwardPage() {
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <OrderListWrapper>
        <div className="w-full p-2 flex justify-between">
          <div>
            <h1 className="text-2xl font-bold">Inward</h1>
          </div>
          <div>
            <AddOrderDialog orderType="inward" />
          </div>
        </div>
        <OrderList orderType="inward" />
      </OrderListWrapper>
    </div>
  );
}
