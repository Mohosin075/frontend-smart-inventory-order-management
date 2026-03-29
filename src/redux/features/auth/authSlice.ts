import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

type AuthState = {
    accessToken: string | null;
    role: string | null;
};

const initialState: AuthState = {
    accessToken: null,
    role: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{
                accessToken: string;
                role: string;
            }>
        ) => {
            state.accessToken = action.payload.accessToken;
            state.role = action.payload.role;
        },
        setToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
        },
        logout: (state) => {
            state.accessToken = null;
            state.role = null;
        },
    },
});

export const { setCredentials, setToken, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectRole = (state: RootState) => state.auth.role;
export const selectIsAuthenticated = (state: RootState) => !!state.auth.accessToken;
