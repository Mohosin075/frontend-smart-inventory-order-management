import { baseApi } from "../../api/baseApi";

export const orderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getOrders: builder.query({
            query: (params) => ({
                url: "/orders",
                params,
            }),
            providesTags: ["Order"],
        }),
        getOrderById: builder.query({
            query: (id) => `/orders/${id}`,
            providesTags: ["Order"],
        }),
        createOrder: builder.mutation({
            query: (data) => ({
                url: "/orders/create",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Order", "Product"],
        }),
        updateOrderStatus: builder.mutation({
            query: (data) => ({
                url: "/orders/update-status",
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Order"],
        }),
        cancelOrder: builder.mutation({
            query: (id) => ({
                url: `/orders/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Order", "Product"],
        }),
    }),
});

export const {
    useGetOrdersQuery,
    useGetOrderByIdQuery,
    useCreateOrderMutation,
    useUpdateOrderStatusMutation,
    useCancelOrderMutation,
} = orderApi;
