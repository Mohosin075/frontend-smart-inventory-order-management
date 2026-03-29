import { baseApi } from "@/redux/api/baseApi";

export enum USER_STATUS {
    ACTIVE = "active",
    INACTIVE = "inactive",
    DELETED = "deleted",
}

interface UserResponse {
    success: boolean;
    message: string;
    data: any;
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

interface SingleUserResponse {
    success: boolean;
    message: string;
    data: any;
}

interface UpdateUserStatusRequest {
    id: string;
    status: USER_STATUS;
}

interface UserQueryParams {
    page?: number;
    limit?: number;
    role?: string;
    status?: USER_STATUS;
    searchTerm?: string;
    subscriptionTier?: string;
}

export const userApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // Get all users with pagination and filters
        getUsers: builder.query<UserResponse, UserQueryParams>({
            query: (params) => {
                const queryParams: Record<string, any> = {};
                queryParams.page = params.page || 1;
                queryParams.limit = params.limit || 10;
                if (params.role) queryParams.role = params.role;
                if (params.status) queryParams.status = params.status;
                if (params.searchTerm) queryParams.searchTerm = params.searchTerm;
                if (params.subscriptionTier) queryParams.subscriptionTier = params.subscriptionTier;

                return {
                    url: "/user",
                    method: "GET",
                    params: queryParams,
                    credentials: "include",
                };
            },
            providesTags: ["User"],
        }),

        // Get single user by ID
        getUserById: builder.query<SingleUserResponse, string>({
            query: (id) => ({
                url: `/user/${id}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: (result, error, id) => [{ type: "User", id }],
        }),

        // Get current user profile
        getUserProfile: builder.query<SingleUserResponse, void>({
            query: () => ({
                url: "/user/profile",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["UserProfile"],
        }),

        // Update user status
        updateUserStatus: builder.mutation<SingleUserResponse, UpdateUserStatusRequest>({
            query: ({ id, status }) => {
                const requestBody: Record<string, any> = {};
                requestBody.status = status;
                return {
                    url: `/user/${id}`,
                    method: "PATCH",
                    body: requestBody,
                    credentials: "include",
                };
            },
            invalidatesTags: (result, error, { id }) => [{ type: "User", id }, "User"],
        }),
    }),
});

export const { useGetUsersQuery, useGetUserByIdQuery, useGetUserProfileQuery, useUpdateUserStatusMutation } = userApi;
