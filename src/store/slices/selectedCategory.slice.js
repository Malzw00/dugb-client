import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: 0
}

const selectedCategorySlice = createSlice({
    name: 'selectedCategory',
    initialState,
    reducers: {
        selectCategory(state, action) {
            state.value = action.payload;
        }
    }
});

export const { selectCategory, } = selectedCategorySlice.actions;
export default selectedCategorySlice.reducer;