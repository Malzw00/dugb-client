import { useContext } from "react";
import { SignupContext } from "./SignUpForm";
import { Button } from "@fluentui/react-components";



export default function CompleteAccountCreationForm() {    

    const { signupData } = useContext(SignupContext);
    // const { setCurrentForm } = useContext(CurrentSignupFormContext);


    const handleSubmit = () => {

    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <h3>{signupData.fname} {signupData.lname}</h3>
            <p>تم إنشاء حسابك على المنصة بنجاح</p>

            <Button appearance="primary" onClick={handleSubmit}>
                الدخول إلى المنصة
            </Button>
        </div>
    );
}