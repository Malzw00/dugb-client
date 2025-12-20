import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Mention20Regular } from "@fluentui/react-icons";
import { Button, Spinner } from "@fluentui/react-components";

import EmailInput from "@PreMadeComponents/EmailInput";
import PasswordInput from "@PreMadeComponents/PasswordInput";
import PlatformHeader from "@PreMadeComponents/PlatformHeader";
import FormHead from "./FormHead";
import { login } from "@services/auth";
import { setUser } from "@slices/user.slice";
import logo from '@resources/logo.png';

export default function LoginForm() {
     const navigate = useNavigate();
     const dispatch = useDispatch();

     const [formState, setFormState] = useState({
          email: { value: '', error: false, errorMessage: '' },
          password: { value: '', error: false, errorMessage: '' }
     });
     
     const [loading, setLoading] = useState(false);
     const [submitError, setSubmitError] = useState('');

     const validateField = useCallback((name, value) => {
          const trimmedValue = value.trim();
          
          if (!trimmedValue) {
               return {
                    error: true,
                    errorMessage: 'هذا الحقل مطلوب'
               };
          }

          if (name === 'email' && !validateEmail(trimmedValue)) {
               return {
                    error: true,
                    errorMessage: 'بريد إلكتروني غير صالح'
               };
          }

          return { error: false, errorMessage: '' };
     }, []);

     const validateForm = useCallback(() => {
          let isValid = true;
          const newFormState = { ...formState };

          Object.keys(newFormState).forEach(key => {
               const validation = validateField(key, newFormState[key].value);
               newFormState[key] = { 
                    ...newFormState[key], 
                    ...validation 
               };
               
               if (validation.error) {
                    isValid = false;
               }
          });

          setFormState(newFormState);
          return isValid;
     }, [formState, validateField]);

     const handleInputChange = useCallback((name, value) => {
          setFormState(prev => ({
               ...prev,
               [name]: {
                    ...prev[name],
                    value,
                    error: false,
                    errorMessage: ''
               }
          }));
          setSubmitError('');
     }, []);

     const handleSubmit = useCallback(async (e) => {
          e.preventDefault();
          
          if (!validateForm()) {
               return;
          }

          setLoading(true);
          setSubmitError('');

          try {
               const loginData = {
                    email: formState.email.value.trim(),
                    password: formState.password.value
               };

               const response = await login(loginData);
               
               if (!response?.data?.success) {
                    throw new Error('فشل تسجيل الدخول');
               }

               const user = response.data.result;
               
               if (!user) {
                    throw new Error('بيانات المستخدم غير متوفرة');
               }

               dispatch(setUser(user));
               navigate('/home');
               
          } catch (error) {
               console.error('Login error:', error);
               setSubmitError(error.message || 'فشلت عملية تسجيل الدخول. الرجاء المحاولة مرة أخرى.');
          } finally {
               setLoading(false);
          }
     }, [formState, validateForm, dispatch, navigate]);

     return (
          <div className='auth-pad'>
               <div className='form'>
                    <PlatformHeader
                         caption='تسجيل الدخول'
                         onBackClick={() => navigate('/home')}
                    />

                    <form
                         className='form-center'
                         onSubmit={handleSubmit}
                         noValidate
                    >
                         <FormHead
                              caption="منصة توثيق مشاريع التخرج الجامعية"
                              title="تسجيل الدخول"
                              logo={logo}
                         />

                         <EmailInput
                              className={formState.email.error ? 'invalid-input' : ''}
                              value={formState.email.value}
                              onChange={(ev) => handleInputChange('email', ev.target.value)}
                              placeholder='أدخل البريد الإلكتروني'
                              contentBefore={<Mention20Regular />}
                              errorMessage={formState.email.errorMessage}
                         />

                         <PasswordInput
                              className={formState.password.error ? 'invalid-input' : ''}
                              value={formState.password.value}
                              onChange={(ev) => handleInputChange('password', ev.target.value)}
                              errorMessage={formState.password.errorMessage}
                         />

                         {submitError && (
                              <div 
                                   className="error-message" 
                                   role="alert"
                                   style={{ color: 'red', marginBottom: '10px' }}
                              >
                                   {submitError}
                              </div>
                         )}

                         <Button
                              appearance='primary'
                              type='submit'
                              disabled={loading}
                              style={{ marginTop: '10px' }}
                         >
                              {loading ? 'جاري التسجيل...' : 'تسجيل الدخول'}
                         </Button>

                         {loading && (
                              <Spinner 
                                   className="spinner" 
                                   size="small" 
                                   style={{ marginTop: '10px' }}
                              />
                         )}

                         {/* رابط استعادة كلمة المرور
                         <Button
                              className='forgot-password-btn'
                              appearance='transparent'
                              style={{ 
                                   alignSelf: 'flex-start', 
                                   marginTop: '15px',
                                   padding: 0 
                              }}
                              type='button'
                              onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
                         >
                              <Key20Regular style={{ marginRight: '5px' }} />
                              هل نسيت كلمة السر؟
                         </Button> */}
                    </form>
               </div>
          </div>
     );
}



export const validateEmail = (email) => {
     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     return regex.test(email);
};