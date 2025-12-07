import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: [0]
}

const selectedCategoriesSlice = createSlice({
    name: 'selectedCategories',
    initialState,
    reducers: {
        selectCategories(state, action) {
            state.value = action.payload;
        }
    }
});

export const { selectCategories, } = selectedCategoriesSlice.actions;
export default selectedCategoriesSlice.reducer;