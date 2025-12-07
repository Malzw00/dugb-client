import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: '',
}

const searchProjectSlice = createSlice({
    name: 'searchProject',
    initialState,
    reducers: {
        setSearchText(state, action) {
            state.value = action.payload;
        }
    }
});

export const { setSearchText, } = searchProjectSlice.actions;
export default searchProjectSlice.reducer;