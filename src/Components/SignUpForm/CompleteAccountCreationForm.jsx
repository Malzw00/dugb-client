import React, { useContext } from "react";
import { SignupContext } from "./SignUpForm";
import { Button, Spinner } from "@fluentui/react-components";
import { useNavigate } from "react-router-dom";
import { register } from "@root/src/services/auth";



export default function CompleteAccountCreationForm() {    

    const navigate = useNavigate();

    const { signupData } = React.useContext(SignupContext);
    const [isLoading, setLoading] = React.useState(true);
    const [success, setSuccess] = React.useState(false);
    
    React.useEffect(() => {
        register({
            fst_name: signupData.fname,
            lst_name: signupData.lname,
            email: signupData.email,
            password: signupData.password,
        
        }).then((res) => {
            setSuccess(res?.data?.success?? false)
        }).catch(err => {
            console.log(err);
        }).finally(() => {
            setLoading(false)
        });
    }, [])

    const handleSubmit = () => {
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {success && <>
                <h3>{signupData.fname} {signupData.lname}</h3>
                <p>تم إنشاء حسابك على المنصة بنجاح</p>
                <p>حسابك جاهز</p>
            </>}

            {(!success && !isLoading) && <p>فشل إنشاء حساب</p>}

            {isLoading && <Spinner className='spinner'/>}

            {success && <Button appearance="primary" onClick={handleSubmit}>
                تسجيل الدخول
            </Button>}
        </div>
    );
}