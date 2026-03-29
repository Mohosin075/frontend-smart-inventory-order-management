import { baseApi } from "../../api/baseApi";

export const recipeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getRecipes: builder.query({
            query: (params) => {
                return {
                    url: "/recipe",
                    method: "GET",
                    params: params,
                };
            },
            providesTags: ["Recipe"],
        }),
        createRecipe: builder.mutation({
            query: (data) => ({
                url: "/recipe",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Recipe"],
        }),
        updateRecipe: builder.mutation({
            query: ({ id, data }) => ({
                url: `/recipe/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Recipe"],
        }),
        deleteRecipe: builder.mutation({
            query: (id) => ({
                url: `/recipe/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Recipe"],
        }),
    }),
});

export const { useGetRecipesQuery, useCreateRecipeMutation, useUpdateRecipeMutation, useDeleteRecipeMutation } = recipeApi;
