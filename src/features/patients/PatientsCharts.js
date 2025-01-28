"use client";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {ChartCard} from '@/features/patients/PChartCard';
import {useFetchPatients} from "@/hooks/usePatients";
import React, {useMemo} from "react";
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

// Define a constant color palette
const COLORS = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
];

const processDataForGenderDistribution = (data) => {
    return Object.values(
        data.reduce((acc, patient) => {
            const gender = patient.sex;
            acc[gender] = acc[gender] || {gender, count: 0};
            acc[gender].count += 1;
            return acc;
        }, {})
    );
};

const processDataForInsuranceDistribution = (data) => {
    return Object.values(
        data.reduce((acc, patient) => {
            const insured = patient.insured ? "Insured" : "Not Insured";
            acc[insured] = acc[insured] || {insured, count: 0};
            acc[insured].count += 1;
            return acc;
        }, {})
    );
};

const processDataForAgeDistribution = (data) => {
    return Object.values(
        data.reduce((acc, patient) => {
            const age = new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear();
            const ageGroup = Math.floor(age / 10) * 10;
            acc[ageGroup] = acc[ageGroup] || {ageGroup, count: 0};
            acc[ageGroup].count += 1;
            return acc;
        }, {})
    );
};

const processDataForPatientGrowth = (data) => {
    return Object.values(
        data.reduce((acc, patient) => {
            const date = patient.created_at.split("T")[0];
            acc[date] = acc[date] || {date, count: 0};
            acc[date].count += 1;
            return acc;
        }, {})
    );
};

const PatientCharts = () => {
    const {data = []} = useFetchPatients();

    // Processed data
    const genderDistributionData = useMemo(() => processDataForGenderDistribution(data), [data]);
    const insuranceDistributionData = useMemo(() => processDataForInsuranceDistribution(data), [data]);
    const ageDistributionData = useMemo(() => processDataForAgeDistribution(data), [data]);
    const patientGrowthData = useMemo(() => processDataForPatientGrowth(data), [data]);
    const totalPatients = data.length;

    const chartConfig = {
        count: {
            label: "Count",
            color: COLORS[0],
        },
    };

    return (
        <div className="my-16">
            <h1 className="text-center">Patient Stats</h1>

            <div className="my-5">
                <p>Total Number of Patients: {totalPatients}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ChartCard title="Gender Distribution">
                    <ChartContainer config={chartConfig}>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={genderDistributionData}
                                    dataKey="count"
                                    nameKey="gender"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius="70%"
                                    fill={COLORS[0]}
                                    label
                                >
                                    {genderDistributionData.map((entry, index) => (
                                        <Cell key={entry.gender}
                                              fill={COLORS[index % COLORS.length]}/>
                                    ))}
                                </Pie>
                                <ChartTooltip cursor={false}
                                              content={<ChartTooltipContent
                                                  hideLabel/>}/>
                                <Legend/>
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </ChartCard>

                <ChartCard title="Insurance Distribution">
                    <ChartContainer config={chartConfig}>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={insuranceDistributionData}
                                    dataKey="count"
                                    nameKey="insured"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius="70%"
                                    fill={COLORS[0]}
                                    label
                                >
                                    {insuranceDistributionData.map((entry, index) => (
                                        <Cell key={entry.insured}
                                              fill={COLORS[index % COLORS.length]}/>
                                    ))}
                                </Pie>
                                <ChartTooltip cursor={false}
                                              content={<ChartTooltipContent
                                                  hideLabel/>}/>
                                <Legend/>
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </ChartCard>

                <ChartCard title="Age Distribution">
                    <ChartContainer config={chartConfig}>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={ageDistributionData}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="ageGroup"/>
                                <YAxis/>
                                <ChartTooltip cursor={false}
                                              content={<ChartTooltipContent
                                                  hideLabel/>}/>
                                <Legend/>
                                <Bar dataKey="count" fill={COLORS[0]}
                                     radius={4}/>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </ChartCard>

                <ChartCard title="Patient Growth Over Time">
                    <ChartContainer config={chartConfig}>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={patientGrowthData}
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
                                <ChartTooltip cursor
                                              content={<ChartTooltipContent
                                                  hideLabel/>}/>
                                <Line
                                    dataKey="count"
                                    type="linear"
                                    stroke={COLORS[0]}
                                    strokeWidth={2}
                                    dot
                                    activeDot={{r: 8}}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </ChartCard>
            </div>
        </div>
    );
};

export default React.memo(PatientCharts);
