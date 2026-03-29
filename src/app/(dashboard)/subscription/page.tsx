"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit2, DollarSign, Users, TrendingUp, CreditCard } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useGetSubscriptionStatsQuery, useGetAllSubscriptionsQuery } from "@/redux/features/dashboard/dashboardApi";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export default function SubscriptionDashboard() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");

  const { data: statsData, isLoading: isStatsLoading, isError: isStatsError } = useGetSubscriptionStatsQuery(undefined);
  const { data: subscriptionsData, isLoading: isSubsLoading, isError: isSubsError } = useGetAllSubscriptionsQuery({
    status: statusFilter === "all" ? undefined : statusFilter,
    plan: planFilter === "all" ? undefined : planFilter
  });

  if (isStatsLoading || isSubsLoading) {
    return (
      <div className="p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isStatsError || isSubsError || !statsData?.success || !subscriptionsData?.success) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <p className="text-destructive">Error loading data. Please try again later.</p>
      </div>
    );
  }

  const stats = statsData.data;
  const rawSubscribers = subscriptionsData.data || [];

  const subscribers = rawSubscribers.filter((sub: any) => {
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
    const matchesPlan = planFilter === "all" || sub.planId?.name === planFilter;
    return matchesStatus && matchesPlan;
  });

  const summaryStats = [
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-[#10B981]", // Green
      bg: "bg-[#FDE8ED]",
    },
    {
      title: "Active Subscriptions",
      value: stats.activeSubscriptions.toString(),
      icon: Users,
      color: "text-[#F48FB1]", // Pink
      bg: "bg-[#FDE8ED]",
    },
    {
      title: "Churn Rate",
      value: `${stats.churnRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-[#EF4444]", // Red
      bg: "bg-[#FDE8ED]",
    },
    {
      title: "MRR",
      value: `$${stats.mrr.toLocaleString()}`,
      icon: CreditCard,
      color: "text-[#F59E0B]", // Orange/Yellow
      bg: "bg-[#FDE8ED]",
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-foreground uppercase tracking-widest">SUBSCRIPTION MANAGEMENT</h1>
          <p className="text-muted-foreground mt-2">Track and manage user subscriptions</p>
        </div>
        <Link href="/subscription/edit">
          <Button className="bg-[#F48FB1] hover:bg-[#F48FB1]/90 text-white gap-2">
            <Edit2 className="w-4 h-4" /> Edit Plans
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {summaryStats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm bg-secondary backdrop-blur-sm">
            <CardContent className="p-6 flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h3 className={`text-2xl font-bold mt-2 ${stat.color}`}>{stat.value}</h3>
              </div>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Middle Section: Distribution & Revenue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Plan Distribution */}
        <Card className="border-none shadow-sm bg-secondary/20 p-6">
            <h3 className="font-serif text-lg uppercase tracking-wider mb-6">PLAN DISTRIBUTION</h3>
            <div className="space-y-6">
                {stats.planDistribution.map((plan: any, index: number) => (
                    <div key={plan.name} className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>{plan.name} ({plan.count})</span>
                            <span>{plan.percentage}%</span>
                        </div>
                        <Progress 
                          value={plan.percentage} 
                          className="h-2 bg-white" 
                          indicatorClassName={index === 0 ? "bg-[#F48FB1]" : "bg-[#F8BBD0]"} 
                        />
                    </div>
                ))}
            </div>
        </Card>

        {/* Revenue Breakdown */}
        <Card className="border-none shadow-sm bg-secondary/20 p-6">
            <h3 className="font-serif text-lg uppercase tracking-wider mb-6">REVENUE BREAKDOWN</h3>
            <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-sm font-medium">Monthly Subscriptions</span>
                    <span className="font-bold">${stats.revenueBreakdown.monthlySubscriptions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-sm font-medium">Yearly Subscriptions</span>
                    <span className="font-bold">${stats.revenueBreakdown.yearlySubscriptions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-[#D1FAE5] rounded-lg text-[#065F46]">
                    <span className="text-sm font-bold">Total Revenue</span>
                    <span className="font-bold">${stats.revenueBreakdown.totalRevenue.toLocaleString()}</span>
                </div>
            </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] bg-input border-none rounded-2xl">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-[180px] bg-input border-none rounded-2xl">
            <SelectValue placeholder="All Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plan</SelectItem>
            <SelectItem value="Monthly">Monthly</SelectItem>
            <SelectItem value="Yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Subscribers List */}
      <div className="space-y-4">
        {subscribers.length > 0 ? (
          subscribers.map((sub: any) => (
            <Card key={sub._id} className="border-none shadow-sm bg-white overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* User Info */}
                  <div className="flex items-start gap-4 min-w-[250px]">
                      <div>
                          <div className="flex items-center gap-2">
                              <h4 className="font-bold text-foreground">{sub.userId?.name}</h4>
                              <Badge className={`${
                                  sub.status === 'active' ? 'bg-[#D1FAE5] text-[#065F46] hover:bg-[#D1FAE5]' : 
                                  'bg-[#FEE2E2] text-[#991B1B] hover:bg-[#FEE2E2]'
                              } border-none`}>
                                  {sub.status}
                              </Badge>
                              <Badge className={`${
                                  sub.planId?.name === 'Monthly' ? 'bg-[#F48FB1] text-white hover:bg-[#F48FB1]' : 
                                  'bg-[#F8BBD0] text-[#880E4F] hover:bg-[#F8BBD0]'
                              } border-none`}>
                                  {sub.planId?.name}
                              </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{sub.userId?.email}</p>
                      </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 md:order-last">
                      <Button variant="outline" size="sm" className="text-red-500 border-red-100 hover:bg-red-50">
                          Cancel
                      </Button>
                      <Button variant="outline" size="sm" className="text-muted-foreground border-gray-200">
                          Refund
                      </Button>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 flex-1 mt-4 md:mt-0">
                      <div>
                          <p className="text-xs text-muted-foreground mb-1">Amount:</p>
                          <p className="font-medium text-sm">${sub.planId?.price.toLocaleString()}</p>
                          {sub.cancelAtPeriodEnd === false && (
                              <Badge variant="outline" className="mt-1 text-[10px] h-5 px-1 bg-gray-50 text-gray-500 border-gray-200 font-normal">
                                  Auto-renew enabled
                              </Badge>
                          )}
                      </div>
                      <div>
                          <p className="text-xs text-muted-foreground mb-1">Payment:</p>
                          <p className="font-medium text-sm">{sub.paymentMethod}</p>
                      </div>
                      <div>
                          <p className="text-xs text-muted-foreground mb-1">Start Date:</p>
                          <p className="font-medium text-sm">{new Date(sub.currentPeriodStart).toLocaleDateString()}</p>
                      </div>
                      <div>
                          <p className="text-xs text-muted-foreground mb-1">End Date:</p>
                          <p className="font-medium text-sm">{new Date(sub.currentPeriodEnd).toLocaleDateString()}</p>
                      </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-10 text-muted-foreground bg-white rounded-xl">
            No subscriptions found.
          </div>
        )}
      </div>
    </div>
  );
}
