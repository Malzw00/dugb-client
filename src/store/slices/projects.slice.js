import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: [],
}

const projectsSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        setProjects(state, action) {
            state.value = action.payload;
        }
    }
});

export const { setProjects, } = projectsSlice.actions;
export default projectsSlice.reducer;