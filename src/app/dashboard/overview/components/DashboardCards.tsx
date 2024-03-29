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
import { AuthenticationError } from "@/lib/errors/auth";
import { useRouter } from "next/navigation";

export type WeekInfo = {
  dayOfWeek: string;
  incoming: number;
  outgoing: number;
};

export default function DashboardCards() {
  const router = useRouter();
  const {
    data: badges,
    error: badgeError,
    isLoading,
  }: {
    data: Badge[] | undefined;
    error: Error | AuthenticationError | null;
    isLoading: boolean;
  } = useQuery({
    queryKey: ["badges"],
    queryFn: getBadge,
  });

  const {
    data: clients,
    error: clientError,
  }: {
    data: Client[] | undefined;
    error: Error | AuthenticationError | null;
  } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });

  const {
    data: productvariants,
    error: productVariantError,
  }: {
    data: ProductVariant[] | undefined;
    error: Error | AuthenticationError | null;
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
    error: monthInfoError,
  }: {
    data: WeekInfo[] | undefined;
    error: Error | AuthenticationError | null;
  } = useQuery({
    queryKey: ["monthInfo"],
    queryFn: getMonthInfo,
  });

  if (badgeError || clientError || productVariantError || monthInfoError) {
    if (
      badgeError instanceof AuthenticationError ||
      clientError instanceof AuthenticationError ||
      productVariantError instanceof AuthenticationError ||
      monthInfoError instanceof AuthenticationError
    ) {
      router.push("/auth/sign-in");
    }

    return <div>There was an error fetching the data</div>;
  }

  return (
    <>
      <div>
        <ModelInfo
          apiName="inward"
          name="Inward"
          badges={badges}
          clients={clients}
          productvariants={productvariants}
          color="text-green-400"
        />
      </div>
      <div>
        <ModelInfo
          apiName="outward"
          name="Outward"
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
            description="Summary of inward and outward for the week"
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
            description="Summary of inward and outward for the month"
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
