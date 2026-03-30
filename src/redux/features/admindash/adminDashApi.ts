import { baseApi } from "@/redux/api/baseApi";

export const adminDashApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getWeeklyEventStats: builder.query({
            query: () => ({
                url: "/stats/admin/events-this-week",
                method: "GET",
            }),
            providesTags: ["Dashboard"],
        }),

        getUserEngagementStats: builder.query({
            query: () => ({
                url: "/stats/admin/user-engagement",
                method: "GET",
            }),
            providesTags: ["Dashboard"],
        }),
    }),
});

export const { useGetWeeklyEventStatsQuery, useGetUserEngagementStatsQuery } = adminDashApi;
