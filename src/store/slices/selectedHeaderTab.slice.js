import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: localStorage['selectedHeaderTab']?? 'projects',
}

const selectedHeaderTabSlice = createSlice({
    name: 'selectedHeaderTab',
    initialState,
    reducers: {
        selectHeaderTab(state, action) {
            localStorage['selectedHeaderTab'] = action.payload
            state.value = action.payload;
        }
    }
});

export const { selectHeaderTab, } = selectedHeaderTabSlice.actions;
export default selectedHeaderTabSlice.reducer;