import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: ''
}

const yearSlice = createSlice({
    name: 'year',
    initialState,
    reducers: {
        setYear(state, action) {
            state.value = action.payload
        }
    }
});

export const { setYear, } = yearSlice.actions;
export default yearSlice.reducer;