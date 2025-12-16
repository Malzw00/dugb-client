import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: 'collages'
    
}

const sideBarContentSlice = createSlice({
    name: 'setSideBarContent',
    initialState,
    reducers: {
        setSideBarContent(state, action) {
            state.value = action.payload
        },
    }
});

export const { setSideBarContent, } = sideBarContentSlice.actions;
export default sideBarContentSlice.reducer;