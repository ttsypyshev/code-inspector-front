// src/store/slices/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    profile: {
        username: string | null;  // заменили email на username
        name: string | null;
        id: string | null;  // новый параметр id
        email: string | null;  // новый параметр email
        role: string | null;  // новый параметр role
    };
    token: string | null;
}

const initialState: UserState = {
    profile: {
        username: localStorage.getItem("username") || null,
        name: localStorage.getItem("name") || null,
        id: localStorage.getItem("id") || null,
        email: localStorage.getItem("email") || null,
        role: localStorage.getItem("role") || null,
    },
    token: localStorage.getItem("token") || null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<{
            username: string;
            name: string;
            id: string;
            email: string;
            role: string;
        }>) => {
            state.profile = action.payload;
            localStorage.setItem("username", action.payload.username);
            localStorage.setItem("name", action.payload.name);
            localStorage.setItem("id", action.payload.id);
            localStorage.setItem("email", action.payload.email);  // сохраняем email
            localStorage.setItem("role", action.payload.role);  // сохраняем role
        },
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            localStorage.setItem("token", action.payload);
        },
        logout: (state) => {
            state.profile = { 
                username: null, 
                name: null, 
                id: null, 
                email: null, 
                role: null 
            };
            state.token = null;
            localStorage.removeItem("username");
            localStorage.removeItem("name");
            localStorage.removeItem("id");
            localStorage.removeItem("email");
            localStorage.removeItem("role");
            localStorage.removeItem("token");
        },
    },
});

export const { setUser, setToken, logout } = userSlice.actions;
export default userSlice.reducer;
