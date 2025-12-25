import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: localStorage['selectedControlPanel']?? 'projects',
}

const selectedControlPanelSlice = createSlice({
    name: 'selectedControlPanel',
    initialState,
    reducers: {
        selectControlPanel(state, action) {
            localStorage['selectedControlPanel'] = action.payload;
            state.value = action.payload;  
        },
    }
});

export const { selectControlPanel, } = selectedControlPanelSlice.actions;
export default selectedControlPanelSlice.reducer;