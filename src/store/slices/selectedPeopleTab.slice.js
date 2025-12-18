import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: localStorage['selectedPeopleTab']?? 'students',
}

const selectedPeopleTabSlice = createSlice({
    name: 'selectedPeopleTab',
    initialState,
    reducers: {
        selectPeopleTab(state, action) {
            localStorage['selectedPeopleTab'] = action.payload
            state.value = action.payload;
        }
    }
});

export const { selectPeopleTab } = selectedPeopleTabSlice.actions;
export default selectedPeopleTabSlice.reducer;