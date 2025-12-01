import { useState, createContext } from 'react';
import FormHead from '../FormHead';
import AccountSetupForm from './AccountSetupForm';
import PersonalInfoForm from './PersonalInfoForm';
import VerificationEmailForm from './VerificationEmailForm';
import CompleteAccountCreation from './CompleteAccountCreationForm';
import logo from '../../resources/logo.png';

// إنشاء سياق بيانات التسجيل
export const SignupContext = createContext({
    signupData: {
        email: '',
        password: '',
        surePassword: '',
        fname: '',
        lname: '',
        bdate: '',
    },
    setSignupData: null,
});

// إنشاء سياق النموذج الحالي
export const CurrentSignupFormContext = createContext({
    currentForm: '',
    setCurrentForm: null,
});

export default function SignUpForm() {

    const [signupData, setSignupData] = useState({
        email: '',
        password: '',
        surePassword: '',
        fname: '',
        lname: '',
        bdate: null,
    });

    const [currentForm, setCurrentForm] = useState('ASF');
    const lowerForm = currentForm.toLowerCase();

    // تحديد النموذج المناسب بناءً على currentForm
    const renderForm = () => {
        switch (lowerForm) {
            case 'pif':
                return <PersonalInfoForm />;
            case 'vef':
                return <VerificationEmailForm />;
            case 'cacf':
                return <CompleteAccountCreation />;
            default:
                return <AccountSetupForm />;
        }
    };

    return (
        <SignupContext.Provider value={{ signupData, setSignupData }}>
            <div className="form">
                <FormHead
                    caption="منصة توثيق مشاريع التخرج الجامعية"
                    title={lowerForm !== 'cacf' ? 'إنشاء حساب جديد' : 'حسابك جاهز'}
                    logo={logo}
                />

                <div className="form-center">
                    <CurrentSignupFormContext.Provider value={{ currentForm, setCurrentForm }}>
                        {renderForm()}
                    </CurrentSignupFormContext.Provider>
                </div>
            </div>
        </SignupContext.Provider>
    );
}