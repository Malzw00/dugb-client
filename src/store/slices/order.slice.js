import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: localStorage['order'] || 'latest'
    
}

export const orderDict = {
    latest:      ['date', 'DESC' ], 
    oldest:      ['date', 'ASC'], 
    topRated:   ['rate', 'DESC' ],
    lowRated:   ['rate', 'ASC'],
    topLiked:   ['likes', 'DESC'],
    lowLiked:   ['likes', 'ASC'],
}

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setOrder(state, action) {
            localStorage['order'] = action.payload
            state.value = action.payload
        },
    }
});

export const { setOrder, } = orderSlice.actions;
export default orderSlice.reducer;