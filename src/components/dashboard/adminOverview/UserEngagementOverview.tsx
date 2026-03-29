// "use client";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useGetUserEngagementStatsQuery } from "@/redux/features/admindash/adminDashApi";
// import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// const data = [
//     { name: "1k", highly_active: 1000, inactive: 1500 },
//     { name: "2k", highly_active: 2200, inactive: 2000 },
//     { name: "3k", highly_active: 3800, inactive: 2600 },
//     { name: "4k", highly_active: 3500, inactive: 2400 },
//     { name: "5k", highly_active: 3200, inactive: 2200 },
//     { name: "6k", highly_active: 3600, inactive: 2500 },
//     { name: "7k", highly_active: 4000, inactive: 2700 },
//     { name: "8k", highly_active: 3800, inactive: 2900 },
//     { name: "9k", highly_active: 4200, inactive: 3200 },
//     { name: "10k", highly_active: 4000, inactive: 3400 },
//     { name: "11k", highly_active: 4400, inactive: 3600 },
//     { name: "12k", highly_active: 4600, inactive: 3800 },
// ];

// export default function UserEngagementOverview() {
//     const { data: userData } = useGetUserEngagementStatsQuery(undefined);
//     console.log(userData);

//     return (
//         <main className="w-full">
//             <Card className="w-full">
//                 <CardHeader>
//                     <CardTitle>User Engagement Breakdown</CardTitle>
//                     <div className="flex gap-4 mt-4">
//                         <div className="flex items-center gap-2">
//                             <div
//                                 className="w-3 h-3 rounded-full"
//                                 style={{
//                                     background: "linear-gradient(90deg, #67E9F1, #24E795)",
//                                 }}
//                             ></div>
//                             <span className="text-sm text-muted-foreground">Highly Active</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <div className="w-3 h-3 rounded-full bg-pink-400"></div>
//                             <span className="text-sm text-muted-foreground">Inactive</span>
//                         </div>
//                     </div>
//                 </CardHeader>
//                 <CardContent>
//                     <ResponsiveContainer width="100%" height={400}>
//                         <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
//                             <XAxis dataKey="name" stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />

//                             <YAxis stroke="var(--muted-foreground)" axisLine={false} tickLine={false} />

//                             <Tooltip
//                                 contentStyle={{
//                                     backgroundColor: "var(--card)",
//                                     border: "1px solid var(--border)",
//                                     borderRadius: "6px",
//                                 }}
//                                 labelStyle={{ color: "var(--foreground)" }}
//                             />

//                             <defs>
//                                 <linearGradient id="gradientLine" x1="0" y1="0" x2="1" y2="0">
//                                     <stop offset="0%" stopColor="#67E9F1" />
//                                     <stop offset="100%" stopColor="#24E795" />
//                                 </linearGradient>
//                             </defs>
//                             <Line type="monotone" dataKey="highly_active" stroke="url(#gradientLine)" strokeWidth={3} dot={false} isAnimationActive={false} name="Highly Active" />
//                             <Line type="monotone" dataKey="inactive" stroke="#FF92AE" strokeWidth={3} dot={false} isAnimationActive={false} name="Inactive" />
//                         </LineChart>
//                     </ResponsiveContainer>
//                 </CardContent>
//             </Card>
//         </main>
//     );
// }

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetUserEngagementStatsQuery } from "@/redux/features/admindash/adminDashApi";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function UserEngagementOverview() {
    const { data: apiResponse, isLoading, isError } = useGetUserEngagementStatsQuery(undefined);

    // Process the API data for the chart
    const chartData =
        apiResponse?.data?.map((item: any) => ({
            name: item.month,
            highly_active: item.highlyActive,
            inactive: item.inactive,
        })) || [];

    // Show loading state
    if (isLoading) {
        return (
            <main className="w-full">
                <Card className="w-full border-gray-100 shadow-sm rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold tracking-tight">System Engagement</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[400px] flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        );
    }

    // Show error state
    if (isError || !apiResponse?.success) {
        return (
            <main className="w-full">
                <Card className="w-full border-gray-100 shadow-sm rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold tracking-tight">System Engagement</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[400px] flex items-center justify-center">
                            <p className="text-red-500 font-medium">Error loading engagement data</p>
                        </div>
                    </CardContent>
                </Card>
            </main>
        );
    }

    return (
        <main className="w-full">
            <Card className="w-full border-gray-100 shadow-sm rounded-2xl overflow-hidden">

                <CardHeader className="border-b border-gray-50 bg-gray-50/30">
                    <CardTitle className="text-lg font-bold tracking-tight">Operational Engagement Breakdown</CardTitle>
                    <div className="flex gap-6 mt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-indigo-600 shadow-sm shadow-indigo-200"></div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Operations</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-slate-200 shadow-sm"></div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Idle Inventory</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                            <XAxis dataKey="name" stroke="#94A3B8" tickLine={false} axisLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                            <YAxis stroke="#94A3B8" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600 }} />

                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#ffffff",
                                    border: "1px solid #F1F5F9",
                                    borderRadius: "12px",
                                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                                }}
                                labelStyle={{ color: "#0F172A", fontWeight: 700, marginBottom: "4px" }}
                                labelFormatter={(label) => `Period: ${label}`}
                                formatter={(value, name) => {
                                    return [value, name === "highly_active" ? "Active Ops" : "Idle Assets"];
                                }}
                            />

                            <Line
                                type="monotone"
                                dataKey="highly_active"
                                stroke="#4F46E5"
                                strokeWidth={4}
                                dot={{ r: 6, fill: "#4F46E5", strokeWidth: 2, stroke: "#ffffff" }}
                                activeDot={{ r: 8, strokeWidth: 0 }}
                                isAnimationActive={true}
                                name="highly_active"
                            />

                            <Line
                                type="monotone"
                                dataKey="inactive"
                                stroke="#CBD5E1"
                                strokeWidth={3}
                                strokeDasharray="5 5"
                                dot={{ r: 4, fill: "#ffffff", strokeWidth: 2, stroke: "#CBD5E1" }}
                                activeDot={{ r: 6 }}
                                isAnimationActive={true}
                                name="inactive"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </main>
    );

}
