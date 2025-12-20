import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: null
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
                role: action.payload.account_role,
                imageId: action.payload.profile_image_id,
                accessToken: action.payload.accessToken
            }
        },
        clearUser(state) {
            state.value = null;
        },
    }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;