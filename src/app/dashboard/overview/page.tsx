import { Metadata } from "next";
import DashboardCardsWrapper from "./components/DashboardCardWrapper";
import ModelInfo from "./components/ModelInfo";
import DashboardCards from "./components/DashboardCards";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default function DashboardPage() {
  return (
    <>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <DashboardCardsWrapper>
          <div className="grid grid-cols-4 gap-2">
            <DashboardCards />
          </div>
        </DashboardCardsWrapper>
      </div>
    </>
  );
}
