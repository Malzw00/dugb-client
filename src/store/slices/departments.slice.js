import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: [
        {
            department_id: 1,
            department_name: 'Information Technology'
        },
        {
            department_id: 2,
            department_name: 'Computer Science'
        },
        {
            department_id: 3,
            department_name: 'Artifical Intelligance'
        },
        {
            department_id: 4,
            department_name: 'Cyber Security'
        },
    ]
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