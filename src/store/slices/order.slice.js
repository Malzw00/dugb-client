import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: 'latest'
    
}

export const orderDict = {
    latest:      ['date', 'ASC' ], 
    oldest:      ['date', 'DESC'], 
    topRated:   ['rate', 'ASC' ],
    lowRated:   ['rate', 'DESC'],
    topLiked:   ['likes', 'ASC'],
    lowLiked:   ['likes', 'DESC'],
}

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setOrder(state, action) {
            state.value = action.payload
        },
        setLatest(state) {
            state.value = ['date', 'ASC'];
        },
        setOldest(state) {
            state.value = ['date', 'DESC'];
        },
        setTopRated(state) {
            state.value = ['rate', 'ASC'];
        },
        setLowRated(state) {
            state.value = ['rate', 'DESC'];
        },
        setTopLiked(state) {
            state.value = ['likes', 'ASC'];
        },
        setLowLiked(state) {
            state.value = ['likes', 'DESC'];
        },
    }
});

export const { setOrder, } = orderSlice.actions;
export default orderSlice.reducer;