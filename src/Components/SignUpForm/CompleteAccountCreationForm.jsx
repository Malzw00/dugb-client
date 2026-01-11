import React, { useContext } from "react";
import { SignupContext } from "./SignUpForm";
import { Button, Spinner } from "@fluentui/react-components";
import { useNavigate } from "react-router-dom";
import { register } from "@root/src/services/auth";
import { CurrentSignupFormContext } from "./SignUpForm";



export default function CompleteAccountCreationForm() {    

    const navigate = useNavigate();

    const { signupData } = React.useContext(SignupContext);
    const { setCurrentForm } = useContext(CurrentSignupFormContext);
    const [isLoading, setLoading] = React.useState(true);
    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState(false);
    
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
            if(err.status === 409)
                setError(err?.data?.result?.message || 'البريد الإلكتروني موجود بالفعل')
        }).finally(() => {
            setLoading(false)
        });
    }, [])

    const handleLoginBtn = () => {
        navigate('/login');
    };

    const RenderError = () => {
        return <div className="flex-col gap-8px items-stretch">
            <div className="error-text flex-row justify-center paddingB-34px">
                {error || 'فشل إنشاء حساب'}
            </div>
            <Button appearance='primary' onClick={() => setCurrentForm('ASF')}>
                إعادة المحاولة
            </Button>
        </div>
    }

    return (
        <div className="signup-form">
            
            {
                success
                ? <>
                    <h3>{signupData.fname} {signupData.lname}</h3>
                    <p>تم إنشاء حسابك على المنصة بنجاح</p>
                    <p>حسابك جاهز</p>
                </>
                : (!isLoading) && <RenderError/>
            }

            {isLoading && <Spinner className='spinner'/>}

            {<Button appearance={error && 'secondary' || "primary"} onClick={handleLoginBtn}>
                تسجيل الدخول
            </Button>}
        </div>
    );
}