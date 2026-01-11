import { useContext, useState } from "react";
import { SignupContext, CurrentSignupFormContext } from "./SignUpForm";
import { Input, Button, Label } from "@fluentui/react-components";
import { ArrowRight20Regular, Person20Regular } from "@fluentui/react-icons";
import { DatePicker } from "@fluentui/react-datepicker-compat";

export default function PersonalInfoForm() {    

    const { signupData, setSignupData } = useContext(SignupContext);
    const { setCurrentForm } = useContext(CurrentSignupFormContext);
    const [warningText, setWarningText] = useState({ text: "", color: "black" });
    const [fieldWarnings, setFieldWarnings] = useState({
        fname: false,
        lname: false,
        bdate: false
    });

    const isArabic = (text) => /^[\u0600-\u06FF\s]+$/.test(text);
    const isEnglish = (text) => /^[a-zA-Z\s]+$/.test(text);
    const hasNumbers = (text) => /\d/.test(text);

    const detectNameLanguage = (text) => {
        if (text === "") return null;
        const firstChar = text.trim()[0];
        if (/[a-zA-Z]/.test(firstChar)) return "en";
        if (/[\u0600-\u06FF]/.test(firstChar)) return "ar";
        return null;
    };
    

    const validateNameInput = (value) => {

        if (hasNumbers(value)) return false;

        // تحقق من أن اللغة واحدة فقط
        if (value === "") return true;
        
        const firstChar = value.trim()[0];
        if (/[a-zA-Z]/.test(firstChar)) {
            return isEnglish(value);
        } else if (/[\u0600-\u06FF]/.test(firstChar)) {
            return isArabic(value);
        }
        
        return false; // أي حرف غير عربي أو إنجليزي
    };

    const handleInputChange = (field) => (ev) => {
        
        const value = ev.target.value;
        
        if (validateNameInput(value)) {
            setSignupData({ ...signupData, [field]: value });
            setWarningText({ text: "", color: "black" });
        
        } else {
            setWarningText({ text: "الاسم يجب أن يكون بلغة واحدة فقط ودون أرقام", color: "red" });
        }
    };


    const handleSubmit = () => {

        const fname = signupData.fname.trim();
        const lname = signupData.lname.trim();
    
        const isFnameEmpty = fname === ''; 
        const isLnameEmpty = lname === ''; 
    
        if (isFnameEmpty || isLnameEmpty) {
            setWarningText({ text: "يرجى تعبئة جميع الحقول", color: "red" });
            setFieldWarnings({
                fname: isFnameEmpty,
                lname: isLnameEmpty,
            });
            return;
        }
    
        const fnameLang = detectNameLanguage(fname);
        const lnameLang = detectNameLanguage(lname);
    
        if (fnameLang !== lnameLang) {
            setWarningText({ text: "يجب أن يكون الاسم الأول والثاني بنفس اللغة", color: "red" });
            setFieldWarnings({
                ...fieldWarnings,
                fname: true,
                lname: true,
            });
            return;
        }
    
        // في حال عدم وجود مشاكل
        setWarningText({ text: "", color: "black" });
        setFieldWarnings({
            fname: false,
            lname: false,
        });
        setCurrentForm("CACF");
    };    

    return (
        <div className="signup-form">
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Button 
                    icon={<ArrowRight20Regular />} 
                    appearance="subtle" 
                    onClick={() => setCurrentForm("ASF")} 
                    aria-label="العودة"
                />
                <h3>بياناتك الشخصية</h3>
            </div>

            <Input 
                value={signupData.fname} 
                onChange={handleInputChange("fname")}
                placeholder="الاسم الأول"
                className={fieldWarnings.fname? 'invalid-input': ''}
                contentBefore={<Person20Regular />}
            />

            <Input 
                value={signupData.lname} 
                onChange={handleInputChange("lname")}
                placeholder="الاسم الثاني"
                className={fieldWarnings.lname? 'invalid-input': ''}
                contentBefore={<Person20Regular />}
            />

            <Label style={{ color: warningText.color }}>{warningText.text}</Label>

            <Button appearance="primary" onClick={handleSubmit}>
                التالي
            </Button>
        </div>
    );
}
