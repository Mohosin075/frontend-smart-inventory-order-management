import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { logout, setToken } from "../features/auth/authSlice";

const baseURL = (process.env.NEXT_PUBLIC_BASEURL as string) || "http://localhost:5000";

const baseQuery = fetchBaseQuery({
    baseUrl: `${baseURL}/api/v1`,
    prepareHeaders: (headers, { getState }) => {
        const state = getState() as RootState;
        const token = state.auth.accessToken;
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
        const refreshResult = await baseQuery({ url: "/auth/refresh-token", method: "POST" }, api, extraOptions);

        if (refreshResult.data) {
            const data = refreshResult.data as any;
            if (data.success) {
                api.dispatch(setToken(data.data.accessToken));
                result = await baseQuery(args, api, extraOptions);
            } else {
                api.dispatch(logout());
            }
        } else {
            api.dispatch(logout());
        }
    }

    return result;
};

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Auth", "User", "Dashboard", "Product", "Category", "Order", "Activity", "Restock"],
    endpoints: () => ({}),
});
