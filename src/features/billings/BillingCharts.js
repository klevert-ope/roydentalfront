"use client";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {BChartCard} from "@/features/billings/BChartCard";
import {useFetchBillings} from "@/hooks/useBillings";
import React, {useEffect, useMemo, useState} from "react";
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

// Constants for reusable values
const CHART_COLORS = [
	'hsl(var(--chart-1))',
	'hsl(var(--chart-2))',
	'hsl(var(--chart-3))',
	'hsl(var(--chart-4))',
	'hsl(var(--chart-5))'
];

// Data processing functions
const processDataForLineChart = (data) => {
  return Object.values(
	  data.reduce((acc, item) => {
		  const date = item.created_at.split("T")[0];
		  if (!acc[date]) {
			  acc[date] = {
				  date,
				  billingAmount: 0,
				  totalReceived: 0,
				  balance: 0,
			  };
		  }
		  acc[date].billingAmount += item.billing_amount;
		  acc[date].totalReceived += item.total_received;
		  acc[date].balance += item.balance;
		  return acc;
	  }, {}),
  );
};

const processDataForBarChart = (data) => {
  return Object.values(
	  data.reduce((acc, item) => {
		  const doctorId = item.doctor_id;
		  if (!acc[doctorId]) {
			  acc[doctorId] = {doctorId, billingAmount: 0};
		  }
		  acc[doctorId].billingAmount += item.billing_amount;
		  return acc;
	  }, {}),
  );
};

const processDataForPieChart = (data) => {
  return Object.values(
	  data.reduce((acc, item) => {
		  const procedure = item.procedure;
		  if (!acc[procedure]) {
			  acc[procedure] = {procedure, billingAmount: 0};
		  }
		  acc[procedure].billingAmount += item.billing_amount;
		  return acc;
	  }, {}),
  );
};

const processDataForAreaChart = (data) => {
  return Object.values(
	  data.reduce((acc, item) => {
		  const date = item.created_at.split("T")[0];
		  if (!acc[date]) {
			  acc[date] = {date, paidCashAmount: 0, paidInsuranceAmount: 0};
		  }
		  acc[date].paidCashAmount += item.paid_cash_amount;
		  acc[date].paidInsuranceAmount += item.paid_insurance_amount;
		  return acc;
	  }, {}),
  );
};

const processDataForScatterChart = (data) => {
  return data.map((item) => ({
    billingAmount: item.billing_amount,
    totalReceived: item.total_received,
  }));
};

const processDataForAverageBillingAmount = (data) => {
  return Object.values(
	  data.reduce((acc, item) => {
		  const procedure = item.procedure;
		  if (!acc[procedure]) {
			  acc[procedure] = {procedure, billingAmount: 0, count: 0};
		  }
		  acc[procedure].billingAmount += item.billing_amount;
		  acc[procedure].count += 1;
		  return acc;
	  }, {}),
  ).map((item) => ({
    procedure: item.procedure,
    averageBillingAmount: item.billingAmount / item.count,
  }));
};

const BillingCharts = () => {
	const {data = []} = useFetchBillings();
  const [colors, setColors] = useState([]);

  // Generate a consistent color palette based on data length
  useEffect(() => {
    const generateColors = (length) => {
	    return Array.from(
		    {length},
		    (_, i) => CHART_COLORS[i % CHART_COLORS.length],
	    );
    };
    setColors(generateColors(data.length));
  }, [data.length]);

  // Memoized processed data
	const lineChartData = useMemo(() => processDataForLineChart(data), [
		data,
		processDataForLineChart,
	]);
	const barChartData = useMemo(() => processDataForBarChart(data), [
		data,
		processDataForBarChart,
	]);
	const pieChartData = useMemo(() => processDataForPieChart(data), [
		data,
		processDataForPieChart,
	]);
	const areaChartData = useMemo(() => processDataForAreaChart(data), [
		data,
		processDataForAreaChart,
	]);
	const scatterChartData = useMemo(() => processDataForScatterChart(data), [
		data,
		processDataForScatterChart,
	]);
	const averageBillingAmountData = useMemo(
		() => processDataForAverageBillingAmount(data),
		[data, processDataForAverageBillingAmount],
	);

  // Chart configuration
  const chartConfig = {
    count: {
      label: "Count",
      color: CHART_COLORS[0],
    },
  };

  return (
	  <div>
		  <h1 className="text-center mb-14">Billing Stats</h1>
		  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			  <BChartCard title="Total Billing Amount Over Time">
				  <ChartContainer config={chartConfig}>
					  <ResponsiveContainer width="100%" height={400}>
						  <LineChart data={lineChartData}
						             margin={{left: 10, right: 10}}>
							  <CartesianGrid vertical/>
							  <XAxis
								  dataKey="date"
								  tickLine
								  axisLine
								  tickMargin={8}
								  tickFormatter={(value) => value.slice(0, 7)}
							  />
							  <YAxis/>
							  <ChartTooltip
								  cursor
								  content={<ChartTooltipContent hideLabel/>}
							  />
							  <Line
								  dataKey="billingAmount"
								  type="linear"
								  stroke={CHART_COLORS[0]}
								  strokeWidth={2}
								  dot
								  activeDot={{r: 8}}
							  />
						  </LineChart>
					  </ResponsiveContainer>
				  </ChartContainer>
			  </BChartCard>

			  <BChartCard title="Billing Amount by Doctor">
				  <ChartContainer config={chartConfig}>
					  <ResponsiveContainer width="100%" height={400}>
						  <BarChart data={barChartData}>
							  <CartesianGrid strokeDasharray="3 3"/>
							  <XAxis dataKey="doctorId"/>
							  <YAxis/>
							  <ChartTooltip
								  cursor
								  content={<ChartTooltipContent hideLabel/>}
							  />
							  <Legend/>
							  <Bar
								  dataKey="billingAmount"
								  fill={CHART_COLORS[0]}
								  radius={4}
							  />
						  </BarChart>
					  </ResponsiveContainer>
				  </ChartContainer>
			  </BChartCard>

			  <BChartCard title="Billing Amount by Procedure">
				  <ChartContainer config={chartConfig}>
					  <ResponsiveContainer width="100%" height={400}>
						  <PieChart>
							  <Pie
								  data={pieChartData}
								  dataKey="billingAmount"
								  nameKey="procedure"
								  cx="50%"
								  cy="50%"
								  outerRadius="70%"
								  fill={CHART_COLORS[0]}
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
								  cursor
								  content={<ChartTooltipContent hideLabel/>}
							  />
							  <Legend/>
						  </PieChart>
					  </ResponsiveContainer>
				  </ChartContainer>
			  </BChartCard>

			  <BChartCard title="Paid Amounts (Cash vs. Insurance) Over Time">
				  <ChartContainer config={chartConfig}>
					  <ResponsiveContainer width="100%" height={400}>
						  <AreaChart data={areaChartData}>
							  <CartesianGrid strokeDasharray="3 3"/>
							  <XAxis dataKey="date"/>
							  <YAxis/>
							  <ChartTooltip
								  cursor
								  content={<ChartTooltipContent hideLabel/>}
							  />
							  <Legend/>
							  <Area
								  type="monotone"
								  dataKey="paidCashAmount"
								  stackId="1"
								  stroke={CHART_COLORS[0]}
								  fill={CHART_COLORS[0]}
							  />
							  <Area
								  type="monotone"
								  dataKey="paidInsuranceAmount"
								  stackId="1"
								  stroke={CHART_COLORS[1]}
								  fill={CHART_COLORS[1]}
							  />
						  </AreaChart>
					  </ResponsiveContainer>
				  </ChartContainer>
			  </BChartCard>

			  <BChartCard title="Billing Amount vs. Paid Amount">
				  <ChartContainer config={chartConfig}>
					  <ResponsiveContainer width="100%" height={400}>
						  <ScatterChart data={scatterChartData}>
							  <CartesianGrid/>
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
							  <ZAxis range={[100]}/>
							  <ChartTooltip
								  cursor
								  content={<ChartTooltipContent hideLabel/>}
							  />
							  <Legend/>
							  <Scatter
								  name="Billing vs. Paid"
								  data={scatterChartData}
								  fill={CHART_COLORS[0]}
							  />
						  </ScatterChart>
					  </ResponsiveContainer>
				  </ChartContainer>
			  </BChartCard>

			  <BChartCard title="Average Billing Amount per Procedure">
				  <ChartContainer config={chartConfig}>
					  <ResponsiveContainer width="100%" height={400}>
						  <BarChart data={averageBillingAmountData}>
							  <CartesianGrid strokeDasharray="3 3"/>
							  <XAxis dataKey="procedure"/>
							  <YAxis/>
							  <ChartTooltip
								  cursor
								  content={<ChartTooltipContent hideLabel/>}
							  />
							  <Legend/>
							  <Bar
								  dataKey="averageBillingAmount"
								  fill={CHART_COLORS[0]}
								  radius={4}
							  />
						  </BarChart>
					  </ResponsiveContainer>
				  </ChartContainer>
			  </BChartCard>
		  </div>
	  </div>
  );
};

export default React.memo(BillingCharts);
