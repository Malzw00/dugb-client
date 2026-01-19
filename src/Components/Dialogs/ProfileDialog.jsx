import Dialog from "@components/Dialogs/AbstractDialog";
import { Key16Regular, Key20Regular, Keyboard16Regular, Person48Regular } from "@fluentui/react-icons";
import { getAccountById, updateMyAccount } from "@root/src/services/account";
import { setProfile } from "@root/src/store/slices/profile.slice";
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "@PreMadeComponents/Loading";
import { Button, Input, tokens } from "@fluentui/react-components";
import { changePassword } from "@root/src/services/auth";

export default function ProfileDialog({ style }) {
    
    const dispatch = useDispatch();
    const profile = useSelector(state => state.profile.value);
    const [profileData, setProfileData] = useState({});
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});

    useEffect(() => {
        if (!profile) return;

        setLoading(true);
        
        const thenFunc = res => {
            const user = res?.data?.result || {};
            const newProfileData = {
                id: user.account_id,
                name: user.fst_name,
                fullName: `${user.fst_name} ${user.lst_name}`,
                email: user.account_email,
                role: user.account_role,
                updatedAt: user.updatedAt,
                firstName: user.fst_name,
                lastName: user.lst_name
            };
            setProfileData(newProfileData);
            setEditData(newProfileData);
            setLoading(false);
        };

        const catchFunc = err => {
            console.log(err);
            setLoading(false);
        };
        
        getAccountById(profile).then(thenFunc).catch(catchFunc);

    }, [profile]);

    const handleSaveChanges = async () => {
        try {
            await updateMyAccount({
                fstname: editData.firstName,
                lstname: editData.lastName,
                email: editData.email
            });
            
            const updatedProfileData = {
                ...profileData,
                firstName: editData.firstName,
                lastName: editData.lastName,
                name: editData.firstName,
                fullName: `${editData.firstName} ${editData.lastName}`,
                email: editData.email,
                updatedAt: new Date().toISOString()
            };
            
            setProfileData(updatedProfileData);
            setIsEditing(false);
            
            alert('تم تعديل البيانات بنجاح')
            
        } catch (error) {
            console.error("فشل تحديث البيانات:", error);
        }
    };

    const handleCancelEdit = () => {
        setEditData({
            ...profileData,
            firstName: profileData.firstName,
            lastName: profileData.lastName
        });
        setIsEditing(false);
    };

    const handleInputChange = (field, value) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
    };
    
    return ( 
        <Dialog
            className='person-dialog'
            style={{ minHeight: '20%', height: 'fit-content', ...style }}
            title={loading ? "جاري التحميل..." : 
                  isEditing ? `تعديل بيانات ${profileData?.name}` : 
                  `بيانات ${profileData?.name}`}
            body={
                loading ? 
                <Loading /> :
                isEditing ? 
                <ProfileEditBody 
                    profile={profileData}
                    editData={editData} 
                    onInputChange={handleInputChange} 
                /> :
                <ProfileDialogBody profile={profileData} />
            }
            footer={
                !loading && (
                    <ProfileDialogFooter 
                        isEditing={isEditing}
                        onEditClick={() => setIsEditing(true)}
                        onSaveClick={handleSaveChanges}
                        onCancelClick={handleCancelEdit}
                    />
                )
            }
            onCloseBtnClick={() => dispatch(setProfile(null))}
        />
    );
}

function ProfileDialogBody ({ profile }) {

    return (
        <div className="rows-div profile-body" style={{flexDirection: 'row', gap:'8%'}}>
            <div className="profile-image-div">
                {profile?.profile_image_id ? 
                    <img className="profile-image" alt="صورة الملف الشخصي" /> : 
                    <Person48Regular />
                }
            </div>
            
            <div className='details' style={{ flex: '1', }}>
                {profile?.fullName && <div className="row">
                    <h3 className="field">إسم المستخدم</h3>
                    <p className="value">{profile.fullName}</p>
                </div>}
                
                {profile?.email && <div className="row">
                    <h3 className="field">البريد الإلكتروني</h3>
                    <p className="value">{profile.email}</p>
                </div>}

                {profile?.updatedAt && <div className="row">
                    <h3 className="field">آخر تحديث للبيانات</h3>
                    <p className="value">{new Date(profile.updatedAt).toISOString().slice(0,10)}</p>
                </div>}

                {profile?.role && profile.role.toLowerCase() !== 'user' && <div className="row">
                    <span style={{
                        color: 'white',
                        padding: '0 8px',
                        borderRadius: '5px', 
                        background: tokens.colorStatusSuccessBackground3}}>
                            
                        {profile.role}
                    </span>
                </div>}
            </div>
        </div>
    );
}

function ProfileEditBody ({ editData, onInputChange, profile }) {
    
    const [changePasswordDialog, setChangePasswordDialog] = useState(false);

    return (
        <div className="rows-div edit-profile-body" style={{ flexDirection: 'row', gap:'8%', }}>
            <div className="profile-image-div" >
                {profile?.profile_image_id ? 
                    <img className="profile-image" alt="صورة الملف الشخصي" /> : 
                    <Person48Regular />
                }
            </div>
            
            <div className='details' style={{ 
                display: 'flex',
                justifyContent: 'start', 
                flexDirection: 'column', 
                gap: '13px', 
                flex: '1',
            }}>
            
                <Input
                    value={editData.firstName || ''}
                    title="الاسم الأول"
                    onChange={(e) => onInputChange('firstName', e.target.value)}
                    placeholder="أدخل الاسم الأول"
                    style={{ width: '100%' }}
                />
                
                <Input
                    value={editData.lastName || ''}
                    title="الاسم الأخير"
                    onChange={(e) => onInputChange('lastName', e.target.value)}
                    placeholder="أدخل الاسم الأخير"
                    style={{ width: '100%' }}
                />
                
                <Input
                    type="email"
                    title="البريد الإلكتروني"
                    value={editData.email || ''}
                    onChange={(e) => onInputChange('email', e.target.value)}
                    placeholder="أدخل البريد الإلكتروني"
                    style={{ width: '100%' }}
                />

                <Button 
                    className="self-end"
                    appearance="subtle" 
                    icon={<Key20Regular/>}
                    onClick={() => setChangePasswordDialog(true)}>
                    تغيير كلمة السر
                </Button>
                
                {editData?.role && editData.role.toLowerCase() !== 'user' && (
                    <div className="row" style={{ alignItems:'center' }}>
                        <span style={{
                            color: 'white',
                            padding: '0 8px',
                            borderRadius: '5px', 
                            background: tokens.colorStatusSuccessBackground3,
                            display: 'inline-block',
                            marginTop: '8px'
                        }}>
                            {editData.role}
                        </span>
                        <p style={{ fontSize: '12px', color: tokens.colorNeutralForeground3, marginTop: '4px' }}>
                            (لا يمكن تعديل الدور)
                        </p>
                    </div>
                )}
            </div>

            {changePasswordDialog && <ChangePasswordDialog
                onClose={() => setChangePasswordDialog(false)}
            />}
        </div>
    );
}


function ChangePasswordDialog({ onClose }) {
    const [data, setData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = () => {
        const newErrors = {};
        
        if (!data.currentPassword.trim()) {
            newErrors.submit = 'كلمة السر الحالية مطلوبة';
            return newErrors;
        }
        
        if (!data.newPassword.trim()) {
            newErrors.submit = 'كلمة السر الجديدة مطلوبة';
            return newErrors;
        } else if (data.newPassword.length < 6) {
            newErrors.submit = 'كلمة السر يجب أن تكون 6 أحرف على الأقل';
            return newErrors;
        }
        
        if (data.newPassword !== data.confirmPassword) {
            newErrors.submit = 'كلمات السر غير متطابقة';
            return newErrors;
        }
        
        if (data.currentPassword === data.newPassword) {
            newErrors.submit = 'كلمة السر الجديدة يجب أن تختلف عن الحالية';
            return newErrors;
        }
        
        return newErrors;
    };

    const handleDone = useCallback(async () => {
        const validationErrors = validate();
        
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        
        setErrors({});
        setIsSubmitting(true);
        
        try {
            await changePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword
            });
            
            setData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            
            onClose();

            window.alert('تم تغيير كلمة المرور بنجاح!')
        } catch (error) {
            setErrors({ submit: error.response.data?.message || error.message || 'مشكلة في تغيير كلمة السر' });
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    }, [data, onClose]);

    const handleChange = (field) => (e) => {
        setData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
        // مسح الخطأ عند البدء بالكتابة
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <Dialog
            title="تغيير كلمة السر"
            onCloseBtnClick={onClose}
            body={
                <div className="flex-col gap-13px">
                    <h3>كلمة السر الحالية</h3>
                    <Input
                        type="password"
                        onChange={handleChange('currentPassword')}
                        value={data.currentPassword}
                        placeholder="أدخل كلمة السر الحالية"
                        error={errors.currentPassword}
                        disabled={isSubmitting}
                    />

                    
                    <h3>كلمة السر الجديدة</h3>
                    <Input
                        type="password"
                        onChange={handleChange('newPassword')}
                        value={data.newPassword}
                        placeholder="أدخل كلمة السر الجديدة"
                        error={errors.newPassword}
                        disabled={isSubmitting}
                    />

                    <Input
                        type="password"
                        onChange={handleChange('confirmPassword')}
                        value={data.confirmPassword}
                        placeholder="تأكيد كلمة السر الجديدة"
                        error={errors.confirmPassword}
                        disabled={isSubmitting}
                    />

                    {errors.submit && (
                        <div className="error-text">
                            {errors.submit}
                        </div>
                    )}

                    <br />

                    <div className="flex gap-8px mt-20px">
                        <Button 
                            appearance="primary" 
                            onClick={handleDone}
                            disabled={isSubmitting}
                            loading={isSubmitting}
                        >
                            {isSubmitting ? 'جاري التغيير...' : 'تغيير كلمة السر'}
                        </Button>

                        <Button 
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            إلغاء
                        </Button>
                    </div>
                </div>
            }
        />
    );
}



function ProfileDialogFooter ({ isEditing, onEditClick, onSaveClick, onCancelClick }) {
    return (
        <div style={{
            display: 'flex',
            padding: '8px 0',
            gap: '5px',
            justifyContent: 'flex-end'
        }}>
            {isEditing ? (
                <>
                    <Button appearance="primary" onClick={onSaveClick}>
                        حفظ التغييرات
                    </Button>
                    <Button appearance="secondary" onClick={onCancelClick}>
                        إلغاء
                    </Button>
                </>
            ) : (
                <Button appearance="primary" onClick={onEditClick}>
                    تعديل بيانات الملف الشخصي
                </Button>
            )}
        </div>
    );
}