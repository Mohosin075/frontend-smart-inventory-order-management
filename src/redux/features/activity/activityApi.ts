import { baseApi } from "../../api/baseApi";

export const activityApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getRecentActivities: builder.query({
            query: () => "/activity/recent",
            providesTags: ["Activity"],
        }),
    }),
});

export const { useGetRecentActivitiesQuery } = activityApi;
