import { baseApi } from "@/redux/api/baseApi";

export const dashboardApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getAdminUsersStats: builder.query({
            query: () => ({
                url: "/stats/admin/users",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Dashboard"],
        }),

        getAdminDashboardStats: builder.query({
            query: () => ({
                url: "/stats/admin/dashboard",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Dashboard"],
        }),

        getDashboardStats: builder.query({
            query: () => ({
                url: "/dashboard/stats",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Dashboard"],
        }),

        getSubscriptionStats: builder.query({
            query: () => ({
                url: "/dashboard/subscription-stats",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Dashboard"],
        }),

        getAnalyticsOverview: builder.query({
            query: () => ({
                url: "/dashboard/analytics-overview",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Dashboard"],
        }),

        getAllSubscriptions: builder.query({
            query: (params: { page?: number; limit?: number; status?: string; plan?: string } = {}) => ({
                url: "/subscription/admin/all-subscriptions",
                method: "GET",
                params,
                credentials: "include",
            }),
            providesTags: ["Dashboard"],
        }),

        getSubscriptionPlans: builder.query({
            query: () => ({
                url: "/subscription/admin/plans",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Dashboard"],
        }),

        updateSubscriptionPlan: builder.mutation({
            query: ({ id, body }) => ({
                url: `/subscription/admin/plans/${id}`,
                method: "PATCH",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["Dashboard"],
        }),

        getEventAnalytics: builder.query({
            query: (eventId: string) => ({
                url: `/stats/analytics/${eventId}`,
                method: "GET",
            }),
            providesTags: (result, error, eventId) => [{ type: "EventAnalytics", id: eventId }],
        }),
    }),
});

export const { 
    useGetAdminUsersStatsQuery, 
    useGetAdminDashboardStatsQuery, 
    useGetDashboardStatsQuery, 
    useGetSubscriptionStatsQuery, 
    useGetAnalyticsOverviewQuery,
    useGetAllSubscriptionsQuery,
    useGetSubscriptionPlansQuery,
    useUpdateSubscriptionPlanMutation,
    useGetEventAnalyticsQuery 
} = dashboardApi;
