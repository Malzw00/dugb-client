import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: [],
}

const searchedStudentsSlice = createSlice({
    name: 'searchedStudents',
    initialState,
    reducers: {
        setSearchedStudents(state, action) {
            state.value = action.payload;
        }
    }
});

export const { setSearchedStudents, } = searchedStudentsSlice.actions;
export default searchedStudentsSlice.reducer;