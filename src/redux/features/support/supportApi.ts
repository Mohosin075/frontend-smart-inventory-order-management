import { baseApi } from "@/redux/api/baseApi";

export enum SUPPORT_STATUS {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    SOLVED = "solved",
    CLOSED = "closed",
    REJECTED = "rejected",
}

export enum SUPPORT_CONTENT_TYPE {
    COMMENT = "comment",
    EVENT = "event",
    USER = "user",
    PAYMENT = "payment",
    TECHNICAL = "technical",
    OTHER = "other",
}

export enum SUPPORT_REASON {
    SPAM = "spam",
    HARASSMENT = "harassment",
    INAPPROPRIATE = "inappropriate",
    COPYRIGHT = "copyright",
    PRIVACY = "privacy",
    TECHNICAL = "technical",
    OTHER = "other",
}

interface SupportQueryParams {
    page?: number;
    limit?: number;
    status?: SUPPORT_STATUS;
    contentType?: SUPPORT_CONTENT_TYPE;
    reason?: SUPPORT_REASON;
    searchTerm?: string;
}

interface SupportResponse {
    success: boolean;
    message: string;
    data: {
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        data: any[];
    };
}

interface SingleSupportResponse {
    success: boolean;
    message: string;
    data: any;
}

interface UpdateSupportStatusRequest {
    id: string;
    status: SUPPORT_STATUS;
}

export const supportApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // Get all support tickets with pagination and filters
        getSupports: builder.query<SupportResponse, SupportQueryParams>({
            query: (params) => {
                const queryParams: Record<string, any> = {};

                // Always include pagination with defaults
                queryParams.page = params.page || 1;
                queryParams.limit = params.limit || 10;

                // Include optional params only if they have values
                if (params.status) queryParams.status = params.status;
                if (params.contentType) queryParams.contentType = params.contentType;
                if (params.reason) queryParams.reason = params.reason;
                if (params.searchTerm) queryParams.searchTerm = params.searchTerm;

                return {
                    url: "/support",
                    method: "GET",
                    params: queryParams,
                    credentials: "include",
                };
            },
            providesTags: ["Support"],
        }),

        // Get single support ticket by ID
        getSupportById: builder.query<SingleSupportResponse, string>({
            query: (id) => ({
                url: `/support/${id}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: (result, error, id) => [{ type: "Support", id }],
        }),

        // Delete support ticket
        deleteSupport: builder.mutation<SingleSupportResponse, string>({
            query: (id) => ({
                url: `/support/${id}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: ["Support"],
        }),

        // Update support ticket status
        updateSupportStatus: builder.mutation<SingleSupportResponse, UpdateSupportStatusRequest>({
            query: ({ id, status }) => ({
                url: `/support/${id}`,
                method: "PATCH",
                body: { status },
                credentials: "include",
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Support", id }, "Support"],
        }),
    }),
});

export const { useGetSupportsQuery, useGetSupportByIdQuery, useDeleteSupportMutation, useUpdateSupportStatusMutation } = supportApi;
