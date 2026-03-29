// "use client";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useGetWeeklyEventStatsQuery } from "@/redux/features/admindash/adminDashApi";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// const barChartData = [
//     { name: "Fri", events: 1600 },
//     { name: "Thu", events: 2300 },
//     { name: "Wed", events: 250 },
//     { name: "Tue", events: 1500 },
//     { name: "Mon", events: 100 },
//     { name: "Sun", events: 100 },
//     { name: "Sat", events: 100 },
// ];

// export function EventsChart() {
//     const { data: eventsData } = useGetWeeklyEventStatsQuery(undefined);
//     console.log(eventsData);

//     return (
//         <Card className="w-full">
//             <CardHeader>
//                 <CardTitle>Events Created This Week</CardTitle>
//             </CardHeader>
//             <CardContent>
//                 <ResponsiveContainer width="100%" height={400}>
//                     <BarChart data={barChartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
//                         <XAxis type="number" stroke="var(--muted-foreground)" axisLine={false} tickLine={false} />
//                         <YAxis dataKey="name" type="category" stroke="var(--muted-foreground)" axisLine={false} tickLine={false} />
//                         <Tooltip
//                             contentStyle={{
//                                 backgroundColor: "var(--card)",
//                                 border: "1px solid var(--border)",
//                                 borderRadius: "6px",
//                             }}
//                             labelStyle={{ color: "var(--foreground)" }}
//                         />
//                         <Bar dataKey="events" fill="#1AA367" radius={[0, 4, 4, 0]} barSize={24} />
//                     </BarChart>
//                 </ResponsiveContainer>
//             </CardContent>
//         </Card>
//     );
// }

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetWeeklyEventStatsQuery } from "@/redux/features/admindash/adminDashApi";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export function EventsChart() {
    const { data: apiResponse, isLoading, isError } = useGetWeeklyEventStatsQuery(undefined);

    // Process the API data for the chart - convert full day names to abbreviations
    const chartData =
        apiResponse?.data?.map((item: any) => ({
            name: item.day.substring(0, 3), // Simple abbreviation: first 3 letters
            events: item.count,
        })) || [];

    console.log("Processed Events Chart Data:", chartData);

    // Show loading state
    if (isLoading) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Events Created This Week</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px] flex items-center justify-center">
                        <p>Loading weekly events data...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Show error state
    if (isError || !apiResponse?.success) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Events Created This Week</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px] flex items-center justify-center">
                        <p className="text-red-500">Error loading weekly events data</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Events Created This Week</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                        <XAxis type="number" stroke="var(--muted-foreground)" axisLine={false} tickLine={false} />
                        <YAxis dataKey="name" type="category" stroke="var(--muted-foreground)" axisLine={false} tickLine={false} width={40} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "var(--card)",
                                border: "1px solid var(--border)",
                                borderRadius: "6px",
                            }}
                            labelStyle={{ color: "var(--foreground)" }}
                            formatter={(value) => [`${value} events`, "Count"]}
                        />
                        <Bar dataKey="events" fill="#1AA367" radius={[0, 4, 4, 0]} barSize={24} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
