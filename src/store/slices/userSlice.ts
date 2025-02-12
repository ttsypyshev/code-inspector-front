// src/store/slices/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    profile: {
        username: string | null;  // заменили email на username
        name: string | null;
    };
    token: string | null;
}

const initialState: UserState = {
    profile: {
        username: localStorage.getItem("username") || null,  // заменили email на username
        name: localStorage.getItem("name") || null,
    },
    token: localStorage.getItem("token") || null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<{ username: string; name: string }>) => {
            state.profile = action.payload;
            localStorage.setItem("username", action.payload.username);  // заменили email на username
            localStorage.setItem("name", action.payload.name);
        },
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            localStorage.setItem("token", action.payload);
        },
        logout: (state) => {
            state.profile = { username: null, name: null };  // заменили email на username
            state.token = null;
            localStorage.removeItem("username");  // заменили email на username
            localStorage.removeItem("name");
            localStorage.removeItem("token");
        },
    },
});

export const { setUser, setToken, logout } = userSlice.actions;
export default userSlice.reducer;
