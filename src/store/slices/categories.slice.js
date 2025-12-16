import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: [
        {
            category_id: 1,
            category_name: 'ذكاء إصطناعي'
        },
        {
            category_id: 2,
            category_name: 'حوسبة سحابية'
        },
        {
            category_id: 3,
            category_name: 'خوارزميات'
        },
        {
            category_id: 4,
            category_name: 'مكتبة برمجية'
        },
        {
            category_id: 5,
            category_name: 'صيانة'
        },
    ]
}

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        setCategories(state, action) {
            state.value = action.payload;
        }
    }
});

export const { setCategories, } = categoriesSlice.actions;
export default categoriesSlice.reducer;