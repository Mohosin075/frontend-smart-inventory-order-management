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
        <Card className="w-full border-gray-100 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-gray-50 bg-gray-50/30">
                <CardTitle className="text-lg font-bold tracking-tight">Weekly Activity Trends</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                        <XAxis type="number" stroke="#94A3B8" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600 }} />
                        <YAxis dataKey="name" type="category" stroke="#94A3B8" axisLine={false} tickLine={false} width={40} tick={{ fontSize: 10, fontWeight: 700 }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#ffffff",
                                border: "1px solid #F1F5F9",
                                borderRadius: "12px",
                                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                            }}
                            labelStyle={{ color: "#0F172A", fontWeight: 700, marginBottom: "4px" }}
                            itemStyle={{ color: "#4F46E5", fontWeight: 600, fontSize: "12px" }}
                            formatter={(value) => [`${value} operations`, "Count"]}
                        />
                        <Bar 
                            dataKey="events" 
                            fill="#4F46E5" 
                            radius={[0, 8, 8, 0]} 
                            barSize={32} 
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );

}
