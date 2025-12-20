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
import { useDispatch, useSelector } from 'react-redux';
import { setProfile } from '@root/src/store/slices/profile.slice';



export function UserBtn() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector(state => state.user.value);
    let isAdmin = false;

    if(user)
    isAdmin = user.role === 'admin' || user.role === 'manager';

    const handleProfile = () => dispatch(setProfile(user.accountId));
    
    const handleControl = () => navigate('/home/control');

    const handleSignout = function () {
        navigate('/signout')
    }

    return (
        user
        ? <Menu className='user-menu' positioning={{ autoSize: true, }}>
            <MenuTrigger disableButtonEnhancement>
                <MenuButton className='user-menu-btn' appearance="transparent">
                    <div className='user-menu-btn-content'>
                        {!user.image
                            ? <Avatar className='user-menu-avatar' />
                            : <Image 
                                src={user.image} 
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
                    <MenuItem icon={<Person20Regular />} onClick={handleProfile}>
                        عرض الملف الشخصي
                    </MenuItem>
                    {
                        isAdmin &&
                        <MenuItem icon={<Settings20Regular />} onClick={handleControl}>
                            لوحة التحكم
                        </MenuItem>
                    }
                    <MenuItem style={{ color: 'red' }} icon={<SignOut20Regular />} onClick={handleSignout}>
                        تسجيل الخروج
                    </MenuItem>
                </MenuList>
            </MenuPopover>
        </Menu>
        : <LoginButton/>
    );
}


function LoginButton() {
    
    const navigate = useNavigate();

    return <Button
        appearance='primary'
        onClick={() => {
            navigate('/login');
        }}
        style={{marginInlineStart: 'auto'}}>

        تسجيل الدخول
    </Button>
}