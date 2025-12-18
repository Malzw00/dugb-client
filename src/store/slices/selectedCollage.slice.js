import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: localStorage['selectedCollage']?? 0
}

const selectedCollage = createSlice({
    name: 'selectedCollage',
    initialState,
    reducers: {
        selectCollage(state, action) {
            localStorage['selectedCollage'] = action.payload;
            state.value = action.payload;
        }
    }
});

export const { selectCollage, } = selectedCollage.actions;
export default selectedCollage.reducer;