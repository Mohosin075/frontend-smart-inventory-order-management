import { baseApi } from "../../api/baseApi";

export const dashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardInsights: builder.query({
            query: () => "/dashboard/insights",
            providesTags: ["Dashboard"],
        }),
    }),
});

export const { useGetDashboardInsightsQuery } = dashboardApi;
