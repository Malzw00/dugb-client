import {
    BrowserRouter,
    Routes,
    Route,
    useNavigate,
} from 'react-router-dom';
import { FluentProvider, Spinner, tokens, webLightTheme } from '@fluentui/react-components';
import { createContext, useEffect } from 'react';
import HomePad from '@components/HomePad/HomePad';
import IntroRedirector from '@components/IntroRedirector';
import SmartStart from '@components/SmartStart';
import '@styles/App.css';
import SignUpForm from '@components/SignUpForm/SignUpForm';
import LoginForm from '@components/LoginForm';
import { useDispatch } from "react-redux";
import { loadCurrentUser } from "@store/thunks/auth.thunk";
import Signout from './Signout';




export const GlobalContext = createContext();

/** @type {import('react').CSSProperties} */
const fluentStyle = {
    backgroundColor: 'white',
    height: '100%',
    width: '100%',
};

export default function AppWrapper() {
    return (
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
}


function App() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // load user
    useEffect(() => {
        dispatch(loadCurrentUser());
    }, [dispatch]);

    return (
        <FluentProvider theme={webLightTheme} style={fluentStyle} dir="rtl">
            <div className="app">
                <Routes>
                    <Route path="*" element={<SmartStart/>}/>
                    <Route path="/intro" element={<IntroRedirector/>}/>
                    <Route path="/home/*" element={<HomePad/>}/>
                    <Route path="/auth" element={() => navigate('/login')}/>
                    <Route path="/login" element={<LoginForm/>}/>
                    <Route path="/signup" element={<SignUpForm/>}/>
                    <Route path="/signout" element={<Signout/>}/>
                </Routes>
            </div>
        </FluentProvider>
    );
}