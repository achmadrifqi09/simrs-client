"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import { TrendingUp } from "lucide-react"
import {Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis} from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import Stepper from "@/components/ui/stepper";
import {Step} from "@/types/stepper";
import {useState} from "react";
import {Button} from "@/components/ui/button";


const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
]

const steps: Step[] = [
    {step: 1, title: 'Step pertama'},
    {step: 2, title: 'Step kedua'},
    {step: 3, title: 'Step ketiga'},
]

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
    mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig


const Dashboard = () => {
    const [step, setStep] = useState<number>(1)
    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Dashboard</Heading>
            <Section>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="border-0 shadow-none">
                        <CardHeader>
                            <CardTitle>Area Chart - Stacked</CardTitle>
                            <CardDescription>
                                Showing total visitors for the last 6 months
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig}>
                                <AreaChart
                                    accessibilityLayer
                                    data={chartData}
                                    margin={{
                                        left: 12,
                                        right: 12,
                                    }}
                                >
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        tickFormatter={(value) => value.slice(0, 3)}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent indicator="dot" />}
                                    />
                                    <Area
                                        dataKey="mobile"
                                        type="natural"
                                        fill="var(--color-mobile)"
                                        fillOpacity={0.4}
                                        stroke="var(--color-mobile)"
                                        stackId="a"
                                    />
                                    <Area
                                        dataKey="desktop"
                                        type="natural"
                                        fill="var(--color-desktop)"
                                        fillOpacity={0.4}
                                        stroke="var(--color-desktop)"
                                        stackId="a"
                                    />
                                </AreaChart>
                            </ChartContainer>
                        </CardContent>
                        <CardFooter>
                            <div className="flex w-full items-start gap-2 text-sm">
                                <div className="grid gap-2">
                                    <div className="flex items-center gap-2 font-medium leading-none">
                                        Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                                    </div>
                                    <div className="flex items-center gap-2 leading-none text-muted-foreground">
                                        January - June 2024
                                    </div>
                                </div>
                            </div>
                        </CardFooter>
                    </Card>
                    <Card className="border-0 shadow-none">
                        <CardHeader>
                            <CardTitle>Bar Chart - Horizontal</CardTitle>
                            <CardDescription>January - June 2024</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig}>
                                <BarChart
                                    accessibilityLayer
                                    data={chartData}
                                    layout="vertical"
                                    margin={{
                                        left: -20,
                                    }}
                                >
                                    <XAxis type="number" dataKey="desktop" hide />
                                    <YAxis
                                        dataKey="month"
                                        type="category"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                        tickFormatter={(value) => value.slice(0, 3)}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={5} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                        <CardFooter className="flex-col items-start gap-2 text-sm">
                            <div className="flex gap-2 font-medium leading-none">
                                Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                            </div>
                            <div className="leading-none text-muted-foreground">
                                Showing total visitors for the last 6 months
                            </div>
                        </CardFooter>
                    </Card>
                </div>

            </Section>
            <Section className="mt-6">
                <Stepper
                    steps={steps}
                    activeStep={step}
                    stepperChange={setStep}
                    action={
                        <Button>Simpan</Button>
                    }
                >
                    <div className="mt-4">
                        {step === 1 && (
                            <p>Content step pertama</p>
                        )}
                        {step === 2 && (
                            <p>Content step kedua</p>
                        )}
                        {step === 3 && (
                            <p>Content step ketiga</p>
                        )}
                    </div>
                </Stepper>
            </Section>
        </>
    )
}

export default Dashboard
