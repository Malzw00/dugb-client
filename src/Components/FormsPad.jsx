import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm/SignUpForm";
import { createContext, useState } from "react";
import { Button } from "@fluentui/react-components";
import { PersonAdd20Regular, PersonArrowRight24Regular } from "@fluentui/react-icons";
import ResetPasswordForm from './ResetPasswordForm';



export const CurrentFormContext = createContext();

export default function FormsPad() {
    
    // sessionStorage['Auth-Pad-CurrentForm']?? 'Login'
    //  On first visit this property will be undefine so login will be set when undefine, 
    // the reason for not defining it from the beginning outside the scope of the component 
    // is that when the user refreshes the page login will be set, so that will not be useful
    const [currentForm, setCurrentForm] = useState(sessionStorage['Auth-Pad-CurrentForm']?? 'LoginForm');

    return (
        <div className="forms-pad">
            
            <CurrentFormContext.Provider value={{currentForm, setCurrentForm}}>
                {
                    currentForm === 'LoginForm'? <LoginForm/>: 
                    currentForm === 'SignUpForm'? <SignUpForm/>: 
                    currentForm === 'ResetPasswordForm'? <ResetPasswordForm/>: 
                    ''
                }
            </CurrentFormContext.Provider>

            <Button 
                appearance='transparent' 
                className='non-padding-btn'
                icon={
                    currentForm === 'LoginForm'? <PersonAdd20Regular/>: <PersonArrowRight24Regular/>
                } 
                onClick={() => {
                    const newCurrentForm = currentForm !== 'LoginForm'? 'LoginForm': 'SignUpForm';
                    sessionStorage['Auth-Pad-CurrentForm'] = newCurrentForm
                    setCurrentForm(newCurrentForm);
                }}
            > {currentForm === "LoginForm"? 'إنشاء حساب جديد': 'العودة إلى تسجيل الدخول'} </Button>           
              
        </div>
    )
}