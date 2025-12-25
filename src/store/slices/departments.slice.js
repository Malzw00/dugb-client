import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: []
}

const departmentsSlice = createSlice({
    name: 'departments',
    initialState,
    reducers: {
        setDepartments(state, action) {
            state.value = action.payload;
        }
    }
});

export const { setDepartments, } = departmentsSlice.actions;
export default departmentsSlice.reducer;