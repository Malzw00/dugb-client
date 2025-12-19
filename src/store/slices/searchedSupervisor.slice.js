import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: [],
}

const searchedSupervisorsSlice = createSlice({
    name: 'searchedSupervisors',
    initialState,
    reducers: {
        setSearchedSupervisors(state, action) {
            state.value = action.payload;
        }
    }
});

export const { setSearchedSupervisors, } = searchedSupervisorsSlice.actions;
export default searchedSupervisorsSlice.reducer;