"use client";

import PhaseEngagementTrend from "@/components/dashboard/analytics/PhaseEngagementTrend";
import { Button } from "@/components/ui/button";
import { Users, CheckCircle2, Utensils, Heart, Diamond, Flame } from "lucide-react";
import { useGetAnalyticsOverviewQuery } from "@/redux/features/dashboard/dashboardApi";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
    const { data: analyticsData, isLoading, isError } = useGetAnalyticsOverviewQuery(undefined);

    if (isLoading) {
        return (
            <div className="p-6 space-y-8">
                <div className="flex justify-between items-end">
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                    <div className="flex gap-3">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-32 w-full" />
                    ))}
                </div>
                <Skeleton className="h-[400px] w-full" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        );
    }

    if (isError || !analyticsData?.success) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[400px]">
                <p className="text-destructive font-medium">Error loading analytics overview. Please try again later.</p>
            </div>
        );
    }

    const data = analyticsData.data;

    return (
        <div className="p-6 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-primary uppercase tracking-widest">Analytics Overview</h1>
                    <p className="text-muted-foreground mt-2">Real-time performance metrics for the cycle-syncing nutrition platform.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="text-primary border-primary hover:bg-primary hover:text-white">
                        Last 30 Days
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90 text-white">
                        Generate Report
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-primary/80 font-medium">Total Users</span>
                        <Users className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <h2 className="text-4xl font-serif text-primary font-bold">{data.totalUsers.count.toLocaleString()}</h2>
                    <p className="text-xs text-muted-foreground mt-2">
                        <span className={`font-bold ${data.totalUsers.trend >= 0 ? "text-primary" : "text-destructive"}`}>
                            {data.totalUsers.trend >= 0 ? "↗" : "↘"} {Math.abs(data.totalUsers.trend)}%
                        </span> vs last month
                    </p>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-primary/80 font-medium">Active Subscriptions</span>
                        <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <h2 className="text-4xl font-serif text-primary font-bold">{data.activeSubscriptions.count.toLocaleString()}</h2>
                    <p className="text-xs text-muted-foreground mt-2">
                        <span className={`font-bold ${data.activeSubscriptions.trend >= 0 ? "text-primary" : "text-destructive"}`}>
                            {data.activeSubscriptions.trend >= 0 ? "↗" : "↘"} {Math.abs(data.activeSubscriptions.trend)}%
                        </span> vs last month
                    </p>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-primary/80 font-medium">Recipe Completions</span>
                        <Utensils className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <h2 className="text-4xl font-serif text-primary font-bold">{data.recipeCompletions.count.toLocaleString()}</h2>
                    <p className="text-xs text-muted-foreground mt-2">
                        <span className={`font-bold ${data.recipeCompletions.trend >= 0 ? "text-primary" : "text-destructive"}`}>
                            {data.recipeCompletions.trend >= 0 ? "↗" : "↘"} {Math.abs(data.recipeCompletions.trend)}%
                        </span> vs last month
                    </p>
                </div>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-primary/60 text-sm">User Activity by Cycle Phase</p>
                        <h2 className="text-2xl font-serif text-primary uppercase tracking-widest">Phase Engagement Trend</h2>
                    </div>
                    <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase">
                        ● Live Traffic
                    </div>
                </div>
                <PhaseEngagementTrend data={data.phaseEngagementTrend} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <div className="items-center justify-between mb-4 flex">
                        <h2 className="text-lg font-serif text-primary uppercase tracking-widest">Top Phase Recipes</h2>
                        <button className="text-xs font-semibold text-primary tracking-[0.18em] uppercase">
                            View All
                        </button>
                    </div>
                    <div className="space-y-3">
                        {data.topPhaseRecipes.map((recipe: any, index: number) => (
                            <div
                                key={recipe._id}
                                className="flex items-center justify-between rounded-xl px-4 py-3"
                                style={{ 
                                    backgroundColor: index === 0 ? "#FDE8ED" : index === 1 ? "#E0F2FE" : "#FEF3C7" 
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 text-primary">
                                        {index === 0 ? <Heart className="h-5 w-5" /> : index === 1 ? <Diamond className="h-5 w-5" /> : <Flame className="h-5 w-5" />}
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-foreground">{recipe.title}</div>
                                        <div className="text-xs text-muted-foreground">Phase: {recipe.phase}</div>
                                    </div>
                                </div>
                                <div className="text-right text-xs uppercase tracking-[0.18em] text-primary">
                                    <div className="text-sm font-semibold">{recipe.saves}</div>
                                    <div className="mt-0.5">Saves</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-serif text-primary uppercase tracking-widest">Recent Activity</h2>
                    </div>
                    <div className="space-y-4">
                        {data.recentActivity.map((item: any, index: number) => (
                            <div key={index}>
                                <div className="flex items-start gap-3">
                                    <span className="mt-1 h-2 w-2 rounded-full bg-primary/60" />
                                    <div>
                                        <p className="text-sm text-primary">
                                            <span className="font-semibold">{item.user}</span>: {item.action}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {new Date(item.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                {index !== data.recentActivity.length - 1 && (
                                    <div className="mt-3 border-t border-[#FDE8ED]" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
