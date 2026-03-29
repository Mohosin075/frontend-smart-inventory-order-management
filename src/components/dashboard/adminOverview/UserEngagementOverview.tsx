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

    // console.log("API Response:", apiResponse);

    // Process the API data for the chart
    const chartData =
        apiResponse?.data?.map((item: any) => ({
            name: item.month,
            highly_active: item.highlyActive,
            inactive: item.inactive,
        })) || [];

    console.log("Processed Chart Data:", chartData);

    // Show loading state
    if (isLoading) {
        return (
            <main className="w-full">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>User Engagement Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[400px] flex items-center justify-center">
                            <p>Loading engagement data...</p>
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
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>User Engagement Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[400px] flex items-center justify-center">
                            <p className="text-red-500">Error loading engagement data</p>
                        </div>
                    </CardContent>
                </Card>
            </main>
        );
    }

    return (
        <main className="w-full">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>User Engagement Breakdown</CardTitle>
                    <div className="flex gap-4 mt-4">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{
                                    background: "linear-gradient(90deg, #67E9F1, #24E795)",
                                }}
                            ></div>
                            <span className="text-sm text-muted-foreground">Highly Active</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-pink-400"></div>
                            <span className="text-sm text-muted-foreground">Inactive</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                            <XAxis dataKey="name" stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />

                            <YAxis
                                stroke="var(--muted-foreground)"
                                axisLine={false}
                                tickLine={false}
                                // You might want to adjust the domain based on your data
                                // domain={[0, 'auto']}
                            />

                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "var(--card)",
                                    border: "1px solid var(--border)",
                                    borderRadius: "6px",
                                }}
                                labelStyle={{ color: "var(--foreground)" }}
                                formatter={(value, name) => {
                                    // Format the tooltip values
                                    return [value, name === "highly_active" ? "Highly Active" : "Inactive"];
                                }}
                                labelFormatter={(label) => `Month: ${label}`}
                            />

                            <defs>
                                <linearGradient id="gradientLine" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#67E9F1" />
                                    <stop offset="100%" stopColor="#24E795" />
                                </linearGradient>
                            </defs>

                            <Line
                                type="monotone"
                                dataKey="highly_active"
                                stroke="url(#gradientLine)"
                                strokeWidth={3}
                                dot={{ r: 4 }} // Show dots since data points are few
                                isAnimationActive={true}
                                name="Highly Active"
                            />

                            <Line
                                type="monotone"
                                dataKey="inactive"
                                stroke="#FF92AE"
                                strokeWidth={3}
                                dot={{ r: 4 }} // Show dots since data points are few
                                isAnimationActive={true}
                                name="Inactive"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </main>
    );
}
