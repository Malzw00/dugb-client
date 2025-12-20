import Dialog from "@components/Dialogs/AbstractDialog";
import { Person48Regular } from "@fluentui/react-icons";
import { getAccountById } from "@root/src/services/account";
import { setProfile } from "@root/src/store/slices/profile.slice";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "@PreMadeComponents/Loading";

export default function ProfileDialog() {
    const dispatch = useDispatch();
    const profile = useSelector(state => state.profile.value);
    const [profileData, setProfileData] = useState({});
    const [loading, setLoading] = useState(true); // إضافة حالة loading

    useEffect(() => {
        if (!profile) return;

        setLoading(true); // بدء حالة التحميل
        
        const thenFunc = res => {
            const user = res?.data?.result || {};
            setProfileData({
                id: user.account_id,
                name: user.fst_name,
                fullName: `${user.fst_name} ${user.lst_name}`,
                email: user.account_email,
                role: user.account_role,
                updatedAt: user.updatedAt
            });
            setLoading(false); // إنهاء حالة التحميل بعد الحصول على البيانات
        };

        const catchFunc = err => {
            console.log(err);
            setLoading(false); // إنهاء حالة التحميل في حالة الخطأ
        };
        
        getAccountById(profile).then(thenFunc).catch(catchFunc);

    }, [profile]);
    
    return ( 
        <Dialog
            className='person-dialog'
            style={{ minHeight: '20%', height: 'fit-content' }}
            title={loading ? "جاري التحميل..." : `بيانات ${profileData?.name}`} // تحديث العنوان أثناء التحميل
            body={
                loading ? 
                <Loading /> : // عرض مؤشر التحميل
                <ProfileDialogBody profile={profileData} />
            }
            onCloseBtnClick={() => dispatch(setProfile(null))}
        />
    );
}

function ProfileDialogBody ({ profile }) {
    return (
        <div className="rows-div person-dialog-body" style={{flexDirection: 'row'}}>
            <div className="profile-image-div">
                {profile?.profile_image_id ? 
                    <img className="profile-image" alt="صورة الملف الشخصي" /> : 
                    <Person48Regular />
                }
            </div>
            
            <div className='details'>
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
            </div>
        </div>
    );
}