import {
    BrowserRouter,
    Routes,
    Route,
} from 'react-router-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { createContext, useState } from 'react';
import AuthPad from './Components/AuthPad';
import HomePad from './Components/HomePad/HomePad';
import IntroRedirector from './Components/IntroRedirector';
import SmartStart from './Components/SmartStart';
import './Styles/App.css';



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

    const [globalState, setGlobalState] = useState({
        user: {username: 'md_alzwy', name: 'معاذ الزوي', bdate: '2003/08/02', bio: 'ادرس في كلية تقنية المعلومات'},
    });

    const setUser = (user) => setGlobalState({ ...globalState, user });

    const globalContextValue = { 
        setUser, 
        globalState
    };

    return (
        <GlobalContext.Provider value={globalContextValue}>
            <FluentProvider theme={webLightTheme} style={fluentStyle} dir="rtl">
                <div className="app">
                    <Routes>
                        <Route path="*" element={<SmartStart/>}/>
                        <Route path="/intro" element={<IntroRedirector/>}/>
                        <Route path="/auth" element={<AuthPad/>}/>
                        <Route path="/home/*" element={<HomePad/>}/>
                    </Routes>
                </div>
            </FluentProvider>
        </GlobalContext.Provider>
    );
}