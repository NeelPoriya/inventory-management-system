import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTheme } from "next-themes";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { WeekInfo } from "./DashboardCards";
import { cn } from "@/lib/utils";

type Props = {
  data: WeekInfo[] | undefined;
  title: string;
  description: string;
  chartDivClassname?: string;
};

export function CardsMetric(props: Props) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
        <CardDescription>{props.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className={cn("h-[200px]", props.chartDivClassname)}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={props.data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="text-center">
                          <span className="text-muted-foreground">
                            {payload[0].payload.dayOfWeek}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Inward
                            </span>
                            <span className="font-bold text-green-400">
                              {payload[0].value}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Outward
                            </span>
                            <span className="font-bold text-orange-400">
                              {payload[1].value}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return null;
                }}
              />
              <Line
                type="monotone"
                strokeWidth={2}
                dataKey="incoming"
                activeDot={{
                  r: 6,
                  style: { fill: "var(--theme-primary)", opacity: 0.25 },
                }}
                style={
                  {
                    stroke: "#27ae60",
                    opacity: 1,
                    "--theme-primary": `#fff`,
                  } as React.CSSProperties
                }
              />
              <Line
                type="monotone"
                dataKey="outgoing"
                strokeWidth={2}
                activeDot={{
                  r: 8,
                  style: { fill: "var(--theme-primary)" },
                }}
                style={
                  {
                    stroke: "#e67e22",
                    opacity: 0.75,
                    "--theme-primary": `#fff`,
                  } as React.CSSProperties
                }
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
