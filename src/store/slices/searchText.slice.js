import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: '',
}

const searchTextSlice = createSlice({
    name: 'searchText',
    initialState,
    reducers: {
        setSearchText(state, action) {
            state.value = action.payload;
        }
    }
});

export const { setSearchText, } = searchTextSlice.actions;
export default searchTextSlice.reducer;