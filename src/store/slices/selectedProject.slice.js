import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: []
}

const selectedProjectSlice = createSlice({
    name: 'selectedProject',
    initialState,
    reducers: {
        selectProject(state, action) {
            state.value = action.payload;
        }
    }
});

export const { selectProject, } = selectedProjectSlice.actions;
export default selectedProjectSlice.reducer;