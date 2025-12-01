import { useContext, useState, useCallback } from "react";
import { SignupContext, CurrentSignupFormContext } from "./SignUpForm";
import EmailInput from "../PreMadeComponents/EmailInput";
import PasswordInput from "../PreMadeComponents/PasswordInput";
import { Button, Input, Label } from "@fluentui/react-components";
import { Checkmark20Filled, Key20Regular, Mention20Regular } from "@fluentui/react-icons";

export default function AccountSetupForm() {

    const { signupData, setSignupData } = useContext(SignupContext);
    const { setCurrentForm } = useContext(CurrentSignupFormContext);

    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [warningText, setWarningText] = useState({ text: "", color: "black" });
    const [fieldWarnings, setFieldWarnings] = useState({
        username: false,
        email: false,
        password: false,
        surePassword: false,
    });

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const isValidUsername = (username) => /^[a-zA-Z0-9_]{3,20}$/.test(username);

    const handleChange = useCallback((field) => (event) => {
        const value = event.target.value;
        setSignupData((prev) => {
            const updated = { ...prev, [field]: value };

            if (field === "password" || field === "surePassword") {
                setPasswordsMatch(updated.password === updated.surePassword);
            }

            setFieldWarnings((prevWarn) => ({ ...prevWarn, [field]: false }));
            return updated;
        });
    }, [setSignupData]);

    const validateForm = () => {
        const usernameEmpty = !signupData.username || signupData.username.trim() === "";
        const usernameInvalid = !usernameEmpty && !isValidUsername(signupData.username);
        const emailEmpty = signupData.email.trim() === "";
        const emailInvalid = !emailEmpty && !isValidEmail(signupData.email);
        const passwordEmpty = signupData.password.trim() === "";
        const surePasswordEmpty = signupData.surePassword.trim() === "";
        const passwordTooShort = !passwordEmpty && signupData.password.length < 8;

        if (
            usernameEmpty || usernameInvalid ||
            emailEmpty || emailInvalid ||
            passwordEmpty || passwordTooShort ||
            surePasswordEmpty
        ) {
            setFieldWarnings({
                username: usernameEmpty || usernameInvalid,
                email: emailEmpty || emailInvalid,
                password: passwordEmpty || passwordTooShort,
                surePassword: surePasswordEmpty,
            });

            if (usernameInvalid)
                setWarningText({ 
                    text: "اسم المستخدم يجب أن يحتوي على 3 إلى 20 حرفًا (حروف، أرقام، _ فقط)", color: "red" 
                });
            else if (emailInvalid)
                setWarningText({ text: "صيغة البريد الإلكتروني غير صحيحة", color: "red" });
            else if (passwordTooShort)
                setWarningText({ text: "كلمة المرور يجب أن تكون 8 أحرف على الأقل", color: "red" });
            else setWarningText({text: '', color: 'black'})
            return false;
        }

        if (signupData.password !== signupData.surePassword) {
            setWarningText({ text: "تحقق من تطابق كلمة المرور", color: "red" });
            setFieldWarnings((prev) => ({
                ...prev,
                password: true,
                surePassword: true,
            }));
            return false;
        }

        setWarningText({ text: "", color: "black" });
        return true;
    };

    const handleSubmit = () => {
        if (validateForm()) setCurrentForm("PIF");
    };

    return (
        <>
            <h3>بيانات تسجيل الدخول</h3>

            <Input
                contentBefore={<Mention20Regular />}
                placeholder='اسم المستخدم'
                value={signupData.username || ''}
                className={fieldWarnings.username ? "invalid-input" : ""}
                onChange={handleChange("username")}
            />

            <EmailInput
                className={fieldWarnings.email ? "invalid-input" : ""}
                value={signupData.email}
                placeholder="أدخل بريدك الإلكتروني"
                onChange={handleChange("email")}
            />

            <PasswordInput
                className={fieldWarnings.password ? "invalid-input" : ""}
                value={signupData.password}
                placeholder="أدخل كلمة المرور"
                contentBefore={
                    passwordsMatch && signupData.password.length >= 8 ?
                        <Checkmark20Filled color="green" /> :
                        <Key20Regular />
                }
                onChange={handleChange("password")}
            />

            <PasswordInput
                className={fieldWarnings.surePassword ? "invalid-input" : ""}
                value={signupData.surePassword}
                placeholder="أدخل كلمة المرور مجددًا"
                contentBefore={
                    passwordsMatch && signupData.surePassword.length >= 8 ?
                        <Checkmark20Filled color="green" /> :
                        <Key20Regular />
                }
                onChange={handleChange("surePassword")}
            />

            <Label style={{ color: warningText.color }}>{warningText.text}</Label>

            <Button appearance="primary" onClick={handleSubmit}>
                التالي
            </Button>
        </>
    );
}