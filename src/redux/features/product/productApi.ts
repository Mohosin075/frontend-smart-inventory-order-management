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
        updateCategory: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/products/categories/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Category", "Product"],
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/products/categories/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Category", "Product"],
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
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/products/${id}`,
                method: "DELETE",
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
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useGetProductsQuery,
    useCreateProductMutation,
    useGetProductByIdQuery,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useRestockProductMutation,
} = productApi;
