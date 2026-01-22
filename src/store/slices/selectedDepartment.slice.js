import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: [parseInt(localStorage['selectedDepartment'])?? 0],
}

const selectedDepartmentSlice = createSlice({
    name: 'selectedDepartment',
    initialState,
    reducers: {
        selectDepartment(state, action) {
            localStorage['selectedDepartment'] = action.payload; 
            state.value = action.payload;
        }
    }
});

export const { selectDepartment, } = selectedDepartmentSlice.actions;
export default selectedDepartmentSlice.reducer;