import { baseApi } from "@/redux/api/baseApi";

// Types based on your API response
export interface Message {
    _id: string;
    chatId: string;
    sender: string;
    text: string;
    image: string | null;
    seen: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface SendMessageResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: Message;
}

export interface GetMessagesResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: Message[];
}

export interface SendMessageRequest {
    chatId: string;
    text: string;
    image?: File;
}

export const messageApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // POST: Send a message
        sendMessage: builder.mutation<SendMessageResponse, SendMessageRequest>({
            query: (messageData) => {
                const formData = new FormData();
                formData.append("chatId", messageData.chatId);
                formData.append("text", messageData.text);

                if (messageData.image) {
                    formData.append("images", messageData.image); // single image with key "images"
                }

                return {
                    url: "/message",
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: (_result, _error, { chatId }) => [
                { type: "Message", id: chatId },
                "Chat", // Invalidate chat list when sending message
            ],
        }),

        // GET: Get messages for a chat
        getMessages: builder.query<GetMessagesResponse, string>({
            query: (chatId) => ({
                url: `/message/${chatId}`,
                method: "GET",
            }),
            providesTags: (_result, _error, chatId) => [{ type: "Message", id: chatId }],
        }),
    }),
});

export const { useSendMessageMutation, useGetMessagesQuery, useLazyGetMessagesQuery } = messageApi;
