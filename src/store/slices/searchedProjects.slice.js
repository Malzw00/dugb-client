import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: [],
}

const searchedProjectsSlice = createSlice({
    name: 'searchedProjects',
    initialState,
    reducers: {
        setSearchedProjects(state, action) {
            state.value = action.payload;
        }
    }
});

export const { setSearchedProjects, } = searchedProjectsSlice.actions;
export default searchedProjectsSlice.reducer;