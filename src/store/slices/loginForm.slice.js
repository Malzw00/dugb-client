import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: {
        email: '',
        password: '',
    }
}

const loginFormSlice = createSlice({
    name: 'loginForm',
    initialState,
    reducers: {
        setLoginData(state, action) {
            state.value = action.payload;
        }
    }
});

export const { setLoginData } = loginFormSlice.actions;
export default loginFormSlice.reducer;