import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: 'loading'
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            state.value = {
                accountId: action.payload.account_id,
                fstName: action.payload.fst_name, 
                lstName: action.payload.lst_name, 
                email: action.payload.account_email, 
                role: action.payload.account_role || action.payload.role,
                imageId: action.payload.profile_image_id,
                accessToken: action.payload.accessToken
            }
        },
        setAccessToken(state, action) {
            state.value.accessToken = action.payload
        },
        clearUser(state) {
            state.value = null;
        },
    }
});

export const { setUser, clearUser, setAccessToken } = userSlice.actions;
export default userSlice.reducer;