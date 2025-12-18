import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: localStorage['selectedSearchTab']?? 'projects',
}

const selectedSearchTabSlice = createSlice({
    name: 'selectedSearchTab',
    initialState,
    reducers: {
        selectSearchTab(state, action) {
            localStorage['selectedSearchTab'] = action.payload
            state.value = action.payload;
        }
    }
});

export const { selectSearchTab } = selectedSearchTabSlice.actions;
export default selectedSearchTabSlice.reducer;