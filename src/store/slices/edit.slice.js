import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: null
    // { type: 'collage', object: { collage_name, ... } }
}

const editSlice = createSlice({
    name: 'edit',
    initialState,
    reducers: {
        setEdit(state, action) {
            state.value = action.payload;
        }
    }
});

export const { setEdit, } = editSlice.actions;
export default editSlice.reducer;