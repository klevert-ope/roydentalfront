"use client";
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
import {useFetchPatients} from "@/hooks/usePatients";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {
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
  XAxis,
  YAxis,
} from "recharts";

const PatientCharts = () => {
  const {data = []} = useFetchPatients();
  const [colors, setColors] = useState([]);

  useEffect(() => {
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

  const processDataForGenderDistribution = useCallback((data) => {
    const processedData = data.reduce((acc, patient) => {
      const gender = patient.sex;
      if (!acc[gender]) {
        acc[gender] = { gender, count: 0 };
      }
      acc[gender].count += 1;
      return acc;
    }, {});
    return Object.values(processedData);
  }, []);

  const processDataForInsuranceDistribution = useCallback((data) => {
    const processedData = data.reduce((acc, patient) => {
      const insured = patient.insured ? "Insured" : "Not Insured";
      if (!acc[insured]) {
        acc[insured] = { insured, count: 0 };
      }
      acc[insured].count += 1;
      return acc;
    }, {});
    return Object.values(processedData);
  }, []);

  const processDataForAgeDistribution = useCallback((data) => {
    const processedData = data.reduce((acc, patient) => {
      const age = new Date().getFullYear() -
        new Date(patient.date_of_birth).getFullYear();
      const ageGroup = Math.floor(age / 10) * 10;
      if (!acc[ageGroup]) {
        acc[ageGroup] = { ageGroup, count: 0 };
      }
      acc[ageGroup].count += 1;
      return acc;
    }, {});
    return Object.values(processedData);
  }, []);

  const processDataForPatientGrowth = useCallback((data) => {
    const processedData = data.reduce((acc, patient) => {
      const date = patient.created_at.split("T")[0];
      if (!acc[date]) {
        acc[date] = { date, count: 0 };
      }
      acc[date].count += 1;
      return acc;
    }, {});
    return Object.values(processedData);
  }, []);

  const genderDistributionData = useMemo(
    () => processDataForGenderDistribution(data),
    [data, processDataForGenderDistribution],
  );
  const insuranceDistributionData = useMemo(
    () => processDataForInsuranceDistribution(data),
    [data, processDataForInsuranceDistribution],
  );
  const ageDistributionData = useMemo(
    () => processDataForAgeDistribution(data),
    [data, processDataForAgeDistribution],
  );
  const patientGrowthData = useMemo(
    () => processDataForPatientGrowth(data),
    [data, processDataForPatientGrowth],
  );
  const totalPatients = useMemo(() => data.length, [data]);

  const chartConfig = {
    count: {
      label: "Count",
      color: "var(--chart-1)",
    },
  };

  return (
    <div className={"my-16"}>
      <h1 className="text-center">Patient Stats</h1>

      <div className={"my-5"}>
        <p>Total Number of Patients {totalPatients}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title="Gender Distribution">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={genderDistributionData}
                  dataKey="count"
                  nameKey="gender"
                  cx="50%"
                  cy="50%"
                  outerRadius="70%"
                  fill="var(--chart-1)"
                  label
                >
                  {genderDistributionData.map((entry, index) => (
                    <Cell
                      key={entry.gender}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>

        <ChartCard title="Insurance Distribution">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={insuranceDistributionData}
                  dataKey="count"
                  nameKey="insured"
                  cx="50%"
                  cy="50%"
                  outerRadius="70%"
                  fill="var(--chart-1)"
                  label
                >
                  {insuranceDistributionData.map((entry, index) => (
                    <Cell
                      key={entry.insured}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>

        <ChartCard title="Age Distribution">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer>
              <BarChart data={ageDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ageGroup" />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Legend />
                <Bar dataKey="count" fill="var(--chart-1)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>

        <ChartCard title="Patient Growth Over Time">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer>
              <LineChart
                data={patientGrowthData}
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
                  cursor
                  content={<ChartTooltipContent hideLabel />}
                />
                <Line
                  dataKey="count"
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
      </div>
    </div>
  );
};

export default PatientCharts;

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
