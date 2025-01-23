"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const BillingCharts = ({ data }) => {
  const [colors, setColors] = useState([]);

  useEffect(() => {
    // Generate a consistent color palette
    const generateColors = (length) => {
      const palette = [
        "var(--chart-1)",
        "var(--chart-2)",
        "var(--chart-3)",
        "var(--chart-4)",
        "var(--chart-5)",
      ];
      return Array.from({ length }, (_, i) => palette[i % palette.length]);
    };
    setColors(generateColors(data.length));
  }, [data.length]);

  const processDataForLineChart = useCallback((data) => {
    const processedData = data.reduce((acc, item) => {
      const date = item.created_at.split("T")[0];
      if (!acc[date]) {
        acc[date] = { date, billingAmount: 0, totalReceived: 0, balance: 0 };
      }
      acc[date].billingAmount += item.billing_amount;
      acc[date].totalReceived += item.total_received;
      acc[date].balance += item.balance;
      return acc;
    }, {});
    return Object.values(processedData);
  }, []);

  const processDataForBarChart = useCallback((data) => {
    const processedData = data.reduce((acc, item) => {
      const doctorId = item.doctor_id;
      if (!acc[doctorId]) {
        acc[doctorId] = { doctorId, billingAmount: 0 };
      }
      acc[doctorId].billingAmount += item.billing_amount;
      return acc;
    }, {});
    return Object.values(processedData);
  }, []);

  const processDataForPieChart = useCallback((data) => {
    const processedData = data.reduce((acc, item) => {
      const procedure = item.procedure;
      if (!acc[procedure]) {
        acc[procedure] = { procedure, billingAmount: 0 };
      }
      acc[procedure].billingAmount += item.billing_amount;
      return acc;
    }, {});
    return Object.values(processedData);
  }, []);

  const processDataForAreaChart = useCallback((data) => {
    const processedData = data.reduce((acc, item) => {
      const date = item.created_at.split("T")[0];
      if (!acc[date]) {
        acc[date] = { date, paidCashAmount: 0, paidInsuranceAmount: 0 };
      }
      acc[date].paidCashAmount += item.paid_cash_amount;
      acc[date].paidInsuranceAmount += item.paid_insurance_amount;
      return acc;
    }, {});
    return Object.values(processedData);
  }, []);

  const processDataForScatterChart = useCallback((data) => {
    return data.map((item) => ({
      billingAmount: item.billing_amount,
      totalReceived: item.total_received,
    }));
  }, []);

  const processDataForAverageBillingAmount = useCallback((data) => {
    const processedData = data.reduce((acc, item) => {
      const procedure = item.procedure;
      if (!acc[procedure]) {
        acc[procedure] = { procedure, billingAmount: 0, count: 0 };
      }
      acc[procedure].billingAmount += item.billing_amount;
      acc[procedure].count += 1;
      return acc;
    }, {});

    return Object.values(processedData).map((item) => ({
      procedure: item.procedure,
      averageBillingAmount: item.billingAmount / item.count,
    }));
  }, []);

  const lineChartData = useMemo(
    () => processDataForLineChart(data),
    [data, processDataForLineChart],
  );
  const barChartData = useMemo(
    () => processDataForBarChart(data),
    [data, processDataForBarChart],
  );
  const pieChartData = useMemo(
    () => processDataForPieChart(data),
    [data, processDataForPieChart],
  );
  const areaChartData = useMemo(
    () => processDataForAreaChart(data),
    [data, processDataForAreaChart],
  );
  const scatterChartData = useMemo(
    () => processDataForScatterChart(data),
    [data, processDataForScatterChart],
  );
  const averageBillingAmountData = useMemo(
    () => processDataForAverageBillingAmount(data),
    [data, processDataForAverageBillingAmount],
  );

  const chartConfig = {
    count: {
      label: "Count",
      color: "var(--chart-1)",
    },
  };

  return (
    <div>
      <h1 className="text-center mb-4">Billing Stats</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title="Total Billing Amount Over Time">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer>
              <LineChart
                accessibilityLayer
                data={lineChartData}
                margin={{ left: 10, right: 10 }}
              >
                <CartesianGrid vertical />
                <XAxis
                  dataKey="date"
                  tickLine
                  axisLine
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 7)}
                />
                <YAxis />
                <ChartTooltip
                  cursor={true}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Line
                  dataKey="billingAmount"
                  type="linear"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  dot
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>

        <ChartCard title="Billing Amount by Doctor">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="doctorId" />
                <YAxis />
                <ChartTooltip
                  cursor={true}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Legend />
                <Bar
                  dataKey="billingAmount"
                  fill="var(--chart-1)"
                  radius={4}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>

        <ChartCard title="Billing Amount by Procedure">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieChartData}
                  dataKey="billingAmount"
                  nameKey="procedure"
                  cx="50%"
                  cy="50%"
                  outerRadius="70%"
                  fill="var(--chart-1)"
                  label
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={entry.procedure}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>
                <ChartTooltip
                  cursor={true}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>

        <ChartCard title="Paid Amounts (Cash vs. Insurance) Over Time">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer>
              <AreaChart data={areaChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip
                  cursor={true}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="paidCashAmount"
                  stackId="1"
                  stroke="var(--chart-1)"
                  fill="var(--chart-1)"
                />
                <Area
                  type="monotone"
                  dataKey="paidInsuranceAmount"
                  stackId="1"
                  stroke="var(--chart-2)"
                  fill="var(--chart-2)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>

        <ChartCard title="Billing Amount vs. Paid Amount">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer>
              <ScatterChart data={scatterChartData}>
                <CartesianGrid />
                <XAxis
                  type="number"
                  dataKey="billingAmount"
                  name="billing amount"
                />
                <YAxis
                  type="number"
                  dataKey="totalReceived"
                  name="total received"
                />
                <ZAxis range={[100]} />
                <ChartTooltip
                  cursor={true}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Legend />
                <Scatter
                  name="Billing vs. Paid"
                  data={scatterChartData}
                  fill="var(--chart-1)"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>

        <ChartCard title="Average Billing Amount per Procedure">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer>
              <BarChart data={averageBillingAmountData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="procedure" />
                <YAxis />
                <ChartTooltip
                  cursor={true}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Legend />
                <Bar
                  dataKey="averageBillingAmount"
                  fill="var(--chart-1)"
                  radius={4}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default React.memo(BillingCharts);

const ChartCard = React.memo(({ title, children }) => (
  <Card className="mb-8">
    <CardHeader className="mb-4">
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
    <CardFooter className="flex-col items-start gap-2 text-sm">
      <div className="leading-none text-muted-foreground">{title}</div>
    </CardFooter>
  </Card>
));
