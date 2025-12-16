import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: null
}

const semesterSlice = createSlice({
    name: 'semester',
    initialState,
    reducers: {
        setSemester(state, action) {
            state.value = action.payload
        }
    }
});

export const { setSemester, } = semesterSlice.actions;
export default semesterSlice.reducer;