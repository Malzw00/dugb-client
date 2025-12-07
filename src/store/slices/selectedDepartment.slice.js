import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: [0],
}

const selectedDepartmentSlice = createSlice({
    name: 'selectedDepartment',
    initialState,
    reducers: {
        selectDepartment(state, action) {
            state.value = action.payload;
        }
    }
});

export const { selectDepartment, } = selectedDepartmentSlice.actions;
export default selectedDepartmentSlice.reducer;