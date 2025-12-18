import React from 'react';
import {
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuPopover,
    MenuTrigger,
    Button,
    Image,
} from '@fluentui/react-components';
import { SignOut20Regular, Person20Regular, Settings20Regular } from '@fluentui/react-icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';



export function UserBtn() {

    const navigate = useNavigate();
    const user = useSelector(state => state.user.value);
    const isAdmin = user.role === 'admin' || user.role === 'manager';
    const img = undefined;
    
    // React.useEffect(() => {
    //     // load and set user data
    // }, [])

    return (
        user.accountId
        ? <Menu className='user-menu' positioning={{ autoSize: true, }}>
            <MenuTrigger disableButtonEnhancement>
                <MenuButton className='user-menu-btn' appearance="transparent">
                    <div className='user-menu-btn-content'>
                        {!img
                            ? <Avatar className='user-menu-avatar' />
                            : <Image 
                                src={img} 
                                width={34} 
                                height={34}
                                style={{borderRadius: '50em'}} 
                            />
                        }
                        <div className='user-menu-name'>
                            {`${user.fstName} ${user.lstName}`}
                        </div>
                    </div>
                </MenuButton>
            </MenuTrigger>
            <MenuPopover>
                <MenuList>
                    <MenuItem icon={<Person20Regular />} onClick={() => navigate('profile/user')}>
                        عرض الملف الشخصي
                    </MenuItem>
                    {
                        isAdmin &&
                        <MenuItem icon={<Settings20Regular />} onClick={() => navigate('/home/control')}>
                            لوحة التحكم
                        </MenuItem>
                    }
                    <MenuItem style={{ color: 'red' }} icon={<SignOut20Regular />}>تسجيل الخروج</MenuItem>
                </MenuList>
            </MenuPopover>
        </Menu>
        : <Button
            appearance='primary'
            onClick={() => {
                navigate('/Auth');
            }}
            style={{marginInlineStart: 'auto'}}>

            تسجيل الدخول
        </Button>
    );
}