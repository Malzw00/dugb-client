import Dialog from "@components/Dialogs/AbstractDialog";
import { Person48Regular } from "@fluentui/react-icons";
import { getAccountById, updateMyAccount } from "@root/src/services/account";
import { setProfile } from "@root/src/store/slices/profile.slice";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "@PreMadeComponents/Loading";
import { Button, Input, tokens } from "@fluentui/react-components";

export default function ProfileDialog({ style }) {
    
    const dispatch = useDispatch();
    const profile = useSelector(state => state.profile.value);
    const [profileData, setProfileData] = useState({});
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false); // حالة لتحديد وضع التحرير
    const [editData, setEditData] = useState({}); // بيانات التحرير المؤقتة

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
            setEditData(newProfileData); // تعيين بيانات التحرير
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
            
            alert('تم تعديل ابيانات بنجاح')
            
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
        <div className="rows-div " style={{flexDirection: 'row', gap:'8%'}}>
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
    return (
        <div className="rows-div " style={{ flexDirection: 'row', gap:'8%', }}>
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
        </div>
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