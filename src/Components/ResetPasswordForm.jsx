import { useContext, useState } from 'react';
import { Button, Input } from '@fluentui/react-components';
import FormHead from "./FormHead";
import logo from '../resources/logo.png';
import { MailInboxCheckmark20Regular } from '@fluentui/react-icons/fonts';
import PasswordInput from './PreMadeComponents/PasswordInput';
import EmailInput from './PreMadeComponents/EmailInput';
import { CurrentFormContext } from "./FormsPad";
import { ArrowRight20Regular } from '@fluentui/react-icons';



export default function ResetPasswordForm() {
    const [formdata, setFormdata] = useState({
        email: '',
        OTP: '',
        newPassword: ''
    });
    const [currentForm, setCurrentForm] = useState('ROF');

    return (
        <div className='form'>
            <FormHead caption='منصة توثيق مشاريع التخرج الجامعية' title='تسجيل الدخول' logo={logo}/>

            {currentForm === 'ROF' && (
                <ReqOTPForm
                    email={formdata.email}
                    setEmail={email => setFormdata({ ...formdata, email })}
                    onNext={() => setCurrentForm('VOF')}
                />
            )}

            {currentForm === 'VOF' && (
                <VerifyOTPForm
                    otp={formdata.OTP}
                    setOTP={OTP => setFormdata({ ...formdata, OTP })}
                    onNext={() => setCurrentForm('CPF')}
                    onPrev={() => setCurrentForm('ROF')}
                />
            )}

            {currentForm === 'CPF' && (
                <ChangePasswordForm
                    password={formdata.newPassword}
                    setPassword={newPassword => setFormdata({ ...formdata, newPassword })}
                    onSubmit={() => console.log('Send to backend')}
                />
            )}
        </div>
    );
}


function ReqOTPForm({ email, setEmail, onNext }) {
    return (
        <div className="form-center">
            <h4>طلب رمز التحقق</h4>
            <EmailInput 
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <Button appearance='primary' onClick={onNext}>إرسال رمز</Button>
        </div>
    );
}

function VerifyOTPForm({ otp, setOTP, onNext, onPrev }) {
    return (
        <div className="form-center">
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <Button 
                    icon={<ArrowRight20Regular />} 
                    appearance="subtle" 
                    onClick={() => onPrev()} 
                    aria-label="العودة"
                />
                <h4>تأكيد رمز التحقق</h4>
            </div>
            <Input 
                value={otp} 
                placeholder="رمز التحقق" 
                onChange={e => setOTP(e.target.value)} 
                contentBefore={<MailInboxCheckmark20Regular/>}
            />
            <Button appearance='primary' onClick={onNext}>تأكيد</Button>
        </div>
    );
}

function ChangePasswordForm({ password, setPassword, onSubmit }) {
    const currentFormContext = useContext(CurrentFormContext);
    const [error, setError] = useState('');

    const handleClick = () => {
        if (password.length < 8) {
            setError('كلمة السر يجب أن تتكون من 8 أحرف على الأقل');
            return;
        }

        setError('');
        onSubmit();
        currentFormContext.setCurrentForm('LoginForm');
    };

    return (
        <div className="form-center">
            <h4>تغيير كلمة السر</h4>
            <PasswordInput 
                value={password} 
                placeholder="كلمة السر الجديدة" 
                onChange={e => setPassword(e.target.value)}
            />
            {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
            <Button appearance='primary' onClick={handleClick}>تغيير</Button>
        </div>
    );
}