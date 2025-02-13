import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    profile: {
        username: string | null;
        name: string | null;
        id: string | null;
        email: string | null;
        role: string | null;
    };
    token: string | null;
    projectId: string | null;  // Новое поле для хранения ProjectID
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
    projectId: null,  // Инициализируем с null
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
            localStorage.setItem("email", action.payload.email);
            localStorage.setItem("role", action.payload.role);
        },
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            localStorage.setItem("token", action.payload);
        },
        setProjectID: (state, action: PayloadAction<string | null>) => {
            state.projectId = action.payload;  // Сохраняем ProjectID
            if (action.payload !== null) {
                localStorage.setItem("projectId", action.payload); // Локальное хранилище для ProjectID
            } else {
                localStorage.removeItem("projectId"); // Remove projectId if it's null
            }
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
            state.projectId = null;  // Сбрасываем ProjectID при логауте
            localStorage.removeItem("username");
            localStorage.removeItem("name");
            localStorage.removeItem("id");
            localStorage.removeItem("email");
            localStorage.removeItem("role");
            localStorage.removeItem("token");
            localStorage.removeItem("projectId"); // Удаляем ProjectID
        },
    },
});

export const { setUser, setToken, setProjectID, logout } = userSlice.actions;
export default userSlice.reducer;
