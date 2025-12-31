import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: 'latest'
    
}

export const orderDict = {
    latest:      ['date', 'DESC' ], 
    oldest:      ['date', 'ASC'], 
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
    }
});

export const { setOrder, } = orderSlice.actions;
export default orderSlice.reducer;