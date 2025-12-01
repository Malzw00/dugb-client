import { useContext, useState } from "react";
import { /* SignupContext, */ CurrentSignupFormContext } from "./SignUpForm";
import { Input, Button, Label } from "@fluentui/react-components";
import { ArrowRight20Regular, MailUnread20Regular } from "@fluentui/react-icons";



export default function VerificationEmailForm() {    

    // const { signupData, setSignupData } = useContext(SignupContext);
    const { setCurrentForm } = useContext(CurrentSignupFormContext);
    const [warningText] = useState({ text: "", color: "black" });


    const handleSubmit = () => {
        setCurrentForm('CACF');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Button 
                    icon={<ArrowRight20Regular />} 
                    appearance="subtle" 
                    onClick={() => setCurrentForm("PIF")} 
                    aria-label="العودة"
                />
                <h3>تأكيد البريد الإلكتروني</h3>
            </div>
            <p>تم إرسالة رمز التحقق إلى بريدك الإلكتروني</p>

            <Input 
                placeholder="أدخل رمز التحقق"
                contentBefore={<MailUnread20Regular/>}
            />

            <Label style={{ color: warningText.color }}>{warningText.text}</Label>

            <Button appearance="primary" onClick={handleSubmit}>
                تأكيد
            </Button>
        </div>
    );
}