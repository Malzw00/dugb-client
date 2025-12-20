import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, Spinner, tokens } from "@fluentui/react-components";

import { logout } from "@services/auth";
import { clearUser } from "@slices/user.slice";

export default function Signout() {

     const dispatch = useDispatch();
     const navigate = useNavigate();

     const [logoutState, setLogoutState] = useState({
          status: 'pending', // 'pending' | 'success' | 'error'
          message: 'جاري تسجيل الخروج...'
     });

     const handleLogout = useCallback(async () => {
          try {
               const response = await logout();
               
               if (!response?.data?.success) {
                    throw new Error('فشل عملية تسجيل الخروج');
               }

               dispatch(clearUser(null));
               setLogoutState({
                    status: 'success',
                    message: 'تم تسجيل الخروج بنجاح'
               });
               
               setTimeout(() => {
                    navigate('/home');
               }, 1500);
               
          } catch (error) {
               console.error('Logout error:', error);
               setLogoutState({
                    status: 'error',
                    message: 'فشل تسجيل الخروج. يرجى المحاولة مرة أخرى.'
               });
          }
     }, [dispatch, navigate]);

     useEffect(() => {
          handleLogout();
     }, [handleLogout]);

     const getContent = () => {
          switch (logoutState.status) {
               case 'pending':
                    return (
                         <div
                              style={{
                                   display: 'flex',
                                   gap: '8px',
                                   justifyContent: 'center',
                                   alignItems: 'center',
                                   background: tokens.colorNeutralBackground3,
                                   position: 'fixed',
                                   inset: '0',
                                   height: '100vh',
                                   width: '100vw',
                                   flexDirection: 'column',
                              }}
                         >
                              <Spinner size="medium" />
                              <span>{logoutState.message}</span>
                         </div>
                    );

               case 'error':
                    return (
                         <div
                              style={{
                                   display: 'flex',
                                   gap: '16px',
                                   justifyContent: 'center',
                                   flexDirection: 'column',
                                   alignItems: 'center',
                                   background: tokens.colorNeutralBackground3,
                                   position: 'fixed',
                                   inset: '0',
                                   height: '100vh',
                                   width: '100vw',
                                   padding: '20px',
                              }}
                         >
                              <div style={{ color: tokens.colorPaletteRedForeground1 }}>
                                   {logoutState.message}
                              </div>
                              
                              <div style={{ display: 'flex', gap: '12px' }}>
                                   <Button 
                                        appearance="primary" 
                                        onClick={() => navigate('/home')}
                                   >
                                        الانتقال إلى الصفحة الرئيسية
                                   </Button>
                                   
                                   <Button 
                                        appearance="secondary" 
                                        onClick={handleLogout}
                                   >
                                        إعادة المحاولة
                                   </Button>
                              </div>
                         </div>
                    );

               case 'success':
                    return (
                         <div
                              style={{
                                   display: 'flex',
                                   gap: '16px',
                                   justifyContent: 'center',
                                   alignItems: 'center',
                                   background: tokens.colorNeutralBackground3,
                                   position: 'fixed',
                                   inset: '0',
                                   height: '100vh',
                                   width: '100vw',
                                   flexDirection: 'column',
                              }}
                         >
                              <Spinner size="small" />
                              <span style={{ color: tokens.colorPaletteGreenForeground1 }}>
                                   {logoutState.message}
                              </span>
                         </div>
                    );

               default:
                    return null;
          }
     };

     return <>{getContent()}</>;
}