// src/store/thunks/auth.thunk.js
import api from "@services/api";
import { setUser, setAccessToken, clearUser } from "@slices/user.slice";

export const loadCurrentUser = () => async (dispatch) => {
    try {
        const { data } = await api.get("/auth/me");

        const user = data.result;

        dispatch(setUser(user));

        dispatch(setAccessToken(user.accessToken));

    } catch (error) {
        dispatch(clearUser());
        console.error("Failed to load current user or refresh token:", error);
    }
};