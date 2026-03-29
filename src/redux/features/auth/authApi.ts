import { baseApi } from "@/redux/api/baseApi";

export const authApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials: { email: string; password: string; rememberMe: boolean }) => ({
                url: "/auth/login",
                method: "POST",
                body: credentials,
            }),
        }),
        forgotPassword: builder.mutation({
            query: (data: { email: string }) => ({
                url: "/auth/forget-password",
                method: "POST",
                body: data,
            }),
        }),
        resendOtp: builder.mutation({
            query: (data: { email: string; authType: string }) => ({
                url: "/auth/resend-otp",
                method: "POST",
                body: data,
            }),
        }),
        verifyAccount: builder.mutation({
            query: (data: { email: string; oneTimeCode: string }) => ({
                url: "/auth/verify-account",
                method: "POST",
                body: data,
            }),
        }),
        resetPassword: builder.mutation({
            query: ({ body, token }) => ({
                url: "/auth/reset-password",
                method: "POST",
                body,
                headers: {
                    Authorization: token,
                },
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
                credentials: "include",
            }),
        }),
        refreshToken: builder.mutation({
            query: (data: { refreshToken: string }) => ({
                url: "/auth/refresh-token",
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const { useLoginMutation, useForgotPasswordMutation, useResendOtpMutation, useVerifyAccountMutation, useResetPasswordMutation, useLogoutMutation, useRefreshTokenMutation } = authApi;
