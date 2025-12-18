import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: localStorage['selectedCategory']?? 0
}

const selectedCategorySlice = createSlice({
    name: 'selectedCategory',
    initialState,
    reducers: {
        selectCategory(state, action) {
            localStorage['selectedCategory'] = action.payload; 
            state.value = action.payload;
        }
    }
});

export const { selectCategory, } = selectedCategorySlice.actions;
export default selectedCategorySlice.reducer;