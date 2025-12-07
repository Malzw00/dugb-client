import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: []
}

const selectedCollage = createSlice({
    name: 'selectedCollage',
    initialState,
    reducers: {
        selectCollage(state, action) {
            state.value = action.payload;
        }
    }
});

export const { selectCollage, } = selectedCollage.actions;
export default selectedCollage.reducer;