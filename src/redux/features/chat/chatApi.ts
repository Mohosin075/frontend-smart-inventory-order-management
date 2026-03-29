import { baseApi } from "@/redux/api/baseApi";

// Types based on your API response
export interface ChatParticipant {
    _id: string;
    name: string;
    updatedAt: string;
    profile?: string;
}

export interface LastMessage {
    _id: string;
    sender: {
        _id: string;
        name: string;
    };
    text: string;
    image: string | null;
    seen: boolean;
    createdAt: string;
}

export interface Chat {
    _id: string;
    participants: ChatParticipant[];
    status: boolean;
    updatedAt: string;
    lastMessage: LastMessage;
    unreadCount: number;
}

export interface GetChatsResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: {
        chats: Chat[];
        totalUnreadChats: number;
    };
}

export interface CreateChatResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: {
        chatId: string;
    };
}

export const chatApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // GET: Get all chats
        getChats: builder.query<GetChatsResponse, void>({
            query: () => ({
                url: "/chat",
                method: "GET",
            }),
            providesTags: ["Chat"],
        }),

        // POST: Create chat with specific user
        createChat: builder.mutation<CreateChatResponse, { otherUserId: string }>({
            query: ({ otherUserId }) => ({
                url: `/chat/${otherUserId}`,
                method: "POST",
            }),
            invalidatesTags: ["Chat"],
        }),
    }),
});

export const { useGetChatsQuery, useLazyGetChatsQuery, useCreateChatMutation } = chatApi;
