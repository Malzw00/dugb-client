import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: []
}

const collagesSlice = createSlice({
    name: 'collages',
    initialState,
    reducers: {
        setCollages(state, action) {
            state.value = action.payload;
        }
    }
});

export const { setCollages, } = collagesSlice.actions;
export default collagesSlice.reducer;