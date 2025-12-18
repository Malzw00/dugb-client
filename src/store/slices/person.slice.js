import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: null, // Person ID
}

const personSlice = createSlice({
    name: 'person',
    initialState,
    reducers: {
        setPerson(state, action) {
            state.value = action.payload
        }
    }
});

export const { setPerson, } = personSlice.actions;
export default personSlice.reducer;