import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: null // user_id
}

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfile(state, action) {
            state.value = action.payload
        },
        clearProfile(state) {
            state.value = null;
        },
    }
});

export const { setProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;