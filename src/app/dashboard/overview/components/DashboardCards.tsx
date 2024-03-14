"use client";
import { getBadge } from "@/lib/reactQueries/badge";
import { getClients } from "@/lib/reactQueries/client";
import { getProductVariants } from "@/lib/reactQueries/productvariant";
import { Badge } from "@/types/Badge";
import { Client } from "@/types/Client";
import { ProductVariant } from "@/types/ProductVariant";
import { useQuery } from "@tanstack/react-query";
import ModelInfo from "./ModelInfo";
import { getMonthInfo, getWeekInfo } from "@/lib/reactQueries/info";
import { CardsMetric } from "./StackedBarchart";

export type WeekInfo = {
  dayOfWeek: string;
  incoming: number;
  outgoing: number;
};

export default function DashboardCards() {
  const {
    data: badges,
  }: {
    data: Badge[] | undefined;
  } = useQuery({
    queryKey: ["badges"],
    queryFn: getBadge,
  });

  const {
    data: clients,
  }: {
    data: Client[] | undefined;
  } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });

  const {
    data: productvariants,
  }: {
    data: ProductVariant[] | undefined;
  } = useQuery({
    queryKey: ["product-variants"],
    queryFn: getProductVariants,
  });

  const {
    data: weekInfo,
  }: {
    data: WeekInfo[] | undefined;
  } = useQuery({
    queryKey: ["weekInfo"],
    queryFn: getWeekInfo,
  });

  const {
    data: monthInfo,
  }: {
    data: WeekInfo[] | undefined;
  } = useQuery({
    queryKey: ["monthInfo"],
    queryFn: getMonthInfo,
  });

  return (
    <>
      <div>
        <ModelInfo
          apiName="incoming"
          name="Incoming"
          badges={badges}
          clients={clients}
          productvariants={productvariants}
          color="text-green-400"
        />
      </div>
      <div>
        <ModelInfo
          apiName="outgoing"
          name="Outgoing"
          badges={badges}
          clients={clients}
          productvariants={productvariants}
          color="text-orange-400"
        />
      </div>
      <div className="col-span-2">
        {weekInfo && (
          <CardsMetric
            title="Week Info"
            description="Summary of incoming and outgoing for the week"
            data={weekInfo}
          />
        )}
      </div>
      <div className="col-span-4">
        {monthInfo && (
          <CardsMetric
            title={`Month Info - ${new Date().toLocaleString("default", {
              month: "long",
            })}`}
            description="Summary of incoming and outgoing for the month"
            data={monthInfo?.map((item) => ({
              dayOfWeek:
                item.dayOfWeek +
                " " +
                new Date().toLocaleString("default", { month: "long" }),
              incoming: item.incoming,
              outgoing: item.outgoing,
            }))}
            chartDivClassname="h-[300px]"
          />
        )}
      </div>
    </>
  );
}
