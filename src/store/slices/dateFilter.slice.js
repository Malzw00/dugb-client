import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: { 
        from: "2000-01-01", 
        to: new Date().toISOString().slice(0, 10),
    }
};

const dateFilterSlice = createSlice({
    name: "dateFilter",
    initialState,
    reducers: {
        setFrom(state, action) {
            state.value.from = action.payload;
        },
        setTo(state, action) {
            state.value.to = action.payload;
        },
        setDateFilter(state, action) {
            state.value = {
                from: action.payload.from,
                to: action.payload.to
            };
        }
    }
});

export const { setFrom, setTo, setDateFilter } = dateFilterSlice.actions;
export default dateFilterSlice.reducer;