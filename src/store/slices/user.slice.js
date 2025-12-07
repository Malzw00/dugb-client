import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: {
        accountId: 1,
        fstName: 'muaad', 
        lstName: 'alzwy', 
        email: 'muaad@alzwy.ly', 
        role: 'admin',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsBmB0MzASlFQ0ty-z88E2dTS7OxPI7D4tKw&s',
    }
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            state.value = {
                accountId: action.payload.accountId,
                fstName: action.payload.fstName, 
                lstName: action.payload.lstName, 
                email: action.payload.email, 
                role: action.payload.role,
                image: action.payload.image,
            }
        }
    }
});

export const { setUser, } = userSlice.actions;
export default userSlice.reducer;