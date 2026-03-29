import { baseApi } from "../../api/baseApi";

export const productApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: () => "/products/categories",
            providesTags: ["Category"],
        }),
        createCategory: builder.mutation({
            query: (data) => ({
                url: "/products/categories",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Category"],
        }),
        getProducts: builder.query({
            query: (params) => ({
                url: "/products",
                params,
            }),
            providesTags: ["Product"],
        }),
        createProduct: builder.mutation({
            query: (data) => ({
                url: "/products/products",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Product"],
        }),
        getProductById: builder.query({
            query: (id) => `/products/${id}`,
            providesTags: ["Product"],
        }),
        updateProduct: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/products/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Product"],
        }),
        restockProduct: builder.mutation({
            query: ({ id, quantity }) => ({
                url: `/products/${id}/restock`,
                method: "PATCH",
                body: { quantity },
            }),
            invalidatesTags: ["Product", "Restock"],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useGetProductsQuery,
    useCreateProductMutation,
    useGetProductByIdQuery,
    useUpdateProductMutation,
    useRestockProductMutation,
} = productApi;
