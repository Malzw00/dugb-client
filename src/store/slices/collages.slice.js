import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: [
        {
            collage_id: 1,
            collage_name: 'كلية تقنية المعلومات'
        },
        {
            collage_id: 2,
            collage_name: 'كلية الهندسة'
        },
        {
            collage_id: 3,
            collage_name: 'كلية الطب'
        },
        {
            collage_id: 4,
            collage_name: 'كلية الإعلام'
        },
        {
            collage_id: 5,
            collage_name: 'كلية الآداب'
        },
    ]
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