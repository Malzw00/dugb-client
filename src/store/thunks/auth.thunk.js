// src/store/thunks/auth.thunk.js
import api from "@services/api";
import { setUser, clearUser } from "@slices/user.slice";

export const loadCurrentUser = () => async (dispatch) => {
   
    try {
        
        const { data } = await api.get("/auth/me");
        dispatch(setUser(data.result));

    } catch {
        
        dispatch(clearUser());
    }
};
