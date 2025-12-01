import { useContext, useState } from "react";
import FormHead from "./FormHead";
import EmailInput from "./PreMadeComponents/EmailInput";
import PasswordInput from "./PreMadeComponents/PasswordInput";
import { Key20Regular, Mention20Regular } from "@fluentui/react-icons";
import { Button } from "@fluentui/react-components";
import logo from '../resources/logo.png';
import { CurrentFormContext } from "./FormsPad";


export default function LoginForm() {


    const [warnInput, setWarnInput] = useState({ email: false, pass: false });
    const [formData, setFormData] = useState({ email: '', password: '' });

    const validateForm = () => {
        const emailEmpty = formData.email.trim() === '';
        const passEmpty = formData.password.trim() === '';
        setWarnInput({ email: emailEmpty, pass: passEmpty });
        return !(emailEmpty || passEmpty);
    };

    const currentFormContext = useContext(CurrentFormContext);

    return (
        <div className='form'>
            <FormHead caption='منصة توثيق مشاريع التخرج الجامعية' title='تسجيل الدخول' logo={logo}/>
            <form 
                className='form-center'
                onSubmit={(e) => {
                    e.preventDefault();
                    if (validateForm()) {
                        // إرسال البيانات
                    }
                }}
            >
                <EmailInput
                    className={warnInput.email ? 'invalid-input' : ''}
                    value={formData.email}
                    onChange={(ev) => {
                        setFormData({ ...formData, email: ev.target.value });
                        setWarnInput({ ...warnInput, email: false });
                    }}
                    placeholder='أدخل اسم المستخدم أو البريد الإلكتروني'
                    contentBefore={<Mention20Regular/>}
                />

                <PasswordInput
                    className={warnInput.pass ? 'invalid-input' : ''}
                    value={formData.password}
                    onChange={(ev) => {
                        setFormData({ ...formData, password: ev.target.value });
                        setWarnInput({ ...warnInput, pass: false });
                    }}
                />

                <Button appearance='primary' type='submit'>تسجيل الدخول</Button>

                <Button
                    className='non-padding-btn'
                    icon={<Key20Regular />}
                    appearance='transparent'
                    style={{ alignSelf: 'start' }}
                    type='button'
                    onClick={() => currentFormContext.setCurrentForm('ResetPasswordForm')}
                >
                    هل نسيت كلمة السر
                </Button>
            </form>
        </div>
    );
}
