import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: {
        fstName: '',
        lstName: '',
        email: '',
        password: '',
        surePassword: '',
    }
}

const signupFormSlice = createSlice({
    name: 'signupForm',
    initialState,
    reducers: {
        setFstName(state, action) {
            state.value.fstName = action.payload
        },
        setLstName(state, action) {
            state.value.lstName = action.payload
        },
        setEmail(state, action) {
            state.value.email = action.payload
        },
        setPassword(state, action) {
            state.value.password = action.payload
        },
        setSurePassword(state, action) {
            state.value.surePassword = action.payload
        },
        setSignupData(state, action) {
            state.value = action.payload;
        }
    }
});

export const { 
    setFstName,
    setLstName,
    setEmail,
    setPassword,
    setSurePassword, 
} = signupFormSlice.actions;
export default signupFormSlice.reducer;