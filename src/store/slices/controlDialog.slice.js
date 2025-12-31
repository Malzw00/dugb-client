import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: null
}

const controlDialogSlice = createSlice({
    name: 'controlDialog',
    initialState,
    reducers: {
        setControlDialog(state, { payload }) {
            state.value = payload;
        },
        clearControlDialog(state) {
            state.value = null;
        }
    }
});

export const { setControlDialog, clearControlDialog, } = controlDialogSlice.actions;
export default controlDialogSlice.reducer;