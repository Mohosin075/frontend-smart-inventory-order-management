"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, Eye, Heart, Activity, Spade } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useGetDashboardStatsQuery } from "@/redux/features/dashboard/dashboardApi";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsPage() {
    const { data: statsData, isLoading, isError } = useGetDashboardStatsQuery(undefined);

    if (isLoading) {
        return (
            <div className="p-6 space-y-8">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32 w-full" />
                    ))}
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-8 w-48" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-64 w-full" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !statsData?.success) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[400px]">
                <p className="text-destructive">Error loading analytics data. Please try again later.</p>
            </div>
        );
    }

    const stats = statsData.data;

    return (
        <div className="p-6 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-serif text-foreground uppercase tracking-widest">Analytics Dashboard</h1>
                <p className="text-muted-foreground mt-2">Comprehensive insights and metrics</p>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-secondary border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Users</p>
                                <h3 className="text-3xl font-serif text-primary font-bold mt-2">{stats.totalUsers.toLocaleString()}</h3>
                                <p className="text-xs text-muted-foreground mt-1">+0 this month</p>
                            </div>
                            <Users className="w-8 h-8 text-primary/40" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-secondary border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Views</p>
                                <h3 className="text-3xl font-serif text-[#FF8A65] font-bold mt-2">{stats.totalViews.toLocaleString()}</h3>
                                <p className="text-xs text-muted-foreground mt-1">Recipe views</p>
                            </div>
                            <Eye className="w-8 h-8 text-[#FF8A65]/40" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-secondary border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Favorites</p>
                                <h3 className="text-3xl font-serif text-[#EF5350] font-bold mt-2">{stats.totalFavorites.toLocaleString()}</h3>
                                <p className="text-xs text-muted-foreground mt-1">Recipe favorites</p>
                            </div>
                            <Heart className="w-8 h-8 text-[#EF5350]/40" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-secondary border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-muted-foreground">Active Users</p>
                                <h3 className="text-3xl font-serif text-[#66BB6A] font-bold mt-2">{stats.activeUsers.toLocaleString()}</h3>
                                <p className="text-xs text-muted-foreground mt-1">Online today</p>
                            </div>
                            <Activity className="w-8 h-8 text-[#66BB6A]/40" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Phase-Specific Engagement */}
            <div className="space-y-4">
                <h2 className="text-xl font-serif text-foreground uppercase tracking-widest">Phase-Specific Engagement</h2>
                <p className="text-sm text-muted-foreground">User interaction across different menstrual cycle phases</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.phaseSpecificEngagement.map((phase: any) => (
                        <Card key={phase.phase} className="border-primary/20 shadow-sm">
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                    {phase.phase === "Menstrual" || phase.phase === "Follicular" ? (
                                        <Spade className="w-4 h-4 fill-foreground text-foreground" />
                                    ) : phase.phase === "Ovulation" ? (
                                        <div className="w-4 h-4 rounded-full bg-white border border-gray-300" />
                                    ) : (
                                        <div className="w-4 h-4 rounded-full bg-foreground" />
                                    )}
                                    <span className="font-medium">{phase.phase}</span>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Recipes:</span>
                                        <span className="font-bold">{phase.recipes}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Views:</span>
                                        <span className="font-bold">{phase.views.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Favorites:</span>
                                        <span className="font-bold">{phase.favorites.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Saved:</span>
                                        <span className="font-bold">{phase.saved.toLocaleString()}</span>
                                    </div>
                                    <div className="pt-2 border-t border-dashed border-primary/20 flex justify-between text-primary">
                                        <span>Engagement Rate:</span>
                                        <span>{phase.engagementRate}%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className=" border-none shadow-sm">
                    <CardContent className="p-6 space-y-4">
                        <h2 className="text-sm font-serif uppercase tracking-[0.35em] text-foreground">
                            Phase Distribution
                        </h2>
                        <div className="space-y-4 text-sm">
                            {stats.phaseDistribution.map((item: any) => (
                                <div key={item.phase} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-xs sm:text-sm">
                                        <div className="flex items-center gap-2">
                                            {item.phase === "Menstrual" || item.phase === "Follicular" ? (
                                                <Spade className="w-4 h-4 fill-foreground" />
                                            ) : item.phase === "Ovulation" ? (
                                                <div className="w-3 h-3 rounded-sm rotate-45 bg-foreground" />
                                            ) : (
                                                <div className="w-3 h-3 rounded-full bg-foreground" />
                                            )}
                                            <span>{item.phase}</span>
                                        </div>
                                        <span className="text-muted-foreground">
                                            {item.recipes} recipes ({item.percentage}%)
                                        </span>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-[#FEE4EC] overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-[#F8A8C6]"
                                            style={{ width: `${item.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardContent className="p-6 space-y-4">
                        <h2 className="text-sm font-serif uppercase tracking-[0.35em] text-foreground">
                            Category Distribution
                        </h2>
                        <div className="space-y-4 text-sm">
                            {stats.categoryDistribution.map((item: any) => (
                                <div key={item.category} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-xs sm:text-sm">
                                        <span>{item.category}</span>
                                        <span className="text-muted-foreground">
                                            {item.recipes} recipes ({item.percentage}%)
                                        </span>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-[#FEE4EC] overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-[#F8A8C6]"
                                            style={{ width: `${item.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm">
                <CardContent className="p-6 space-y-4">
                    <h2 className="text-sm font-serif uppercase tracking-[0.35em] text-foreground">
                        Recent User Activity
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Latest user actions and events
                    </p>
                    <div className="space-y-2">
                        {stats.recentActivity.map((item: any, index: number) => (
                            <div
                                key={index}
                                className="flex items-center justify-between rounded-xl bg-[#FFF5F8] px-4 py-3"
                            >
                                <div>
                                    <p className="text-sm font-medium">{item.user}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {item.action}
                                    </p>
                                </div>
                                <div className="text-right text-xs sm:text-sm">
                                    <p className="text-muted-foreground">
                                        {new Date(item.timestamp).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-[#FFF5F8] border-none shadow-sm rounded-3xl">
                <CardContent className="p-6 space-y-6">
                    <h2 className="text-sm font-serif uppercase tracking-[0.35em] text-foreground">
                        Monthly Growth
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        User growth and revenue trends
                    </p>
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <p className="text-xs text-muted-foreground">User Growth</p>
                            <div className="h-40">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={stats.monthlyGrowth}
                                        margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                                        barCategoryGap={5}
                                        barGap={0}
                                    >
                                        <XAxis
                                            dataKey="month"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                                        />
                                        <YAxis hide />
                                        <Tooltip cursor={{ fill: "transparent" }} />
                                        <Bar
                                            dataKey="users"
                                            fill="#F8A8C6"
                                            radius={[18, 18, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <p className="text-xs text-muted-foreground">Revenue Growth</p>
                            <div className="h-40">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={stats.monthlyGrowth}
                                        margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                                        barCategoryGap={5}
                                        barGap={0}
                                    >
                                        <XAxis
                                            dataKey="month"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                                        />
                                        <YAxis hide />
                                        <Tooltip cursor={{ fill: "transparent" }} />
                                        <Bar
                                            dataKey="revenue"
                                            fill="#00B894"
                                            radius={[18, 18, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
