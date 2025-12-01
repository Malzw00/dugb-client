import {useContext} from 'react';
import {
  Input,
  Dropdown,
  Option,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuPopover,
  MenuTrigger,
  Button,

} from '@fluentui/react-components';
import { SignOut20Regular, Person20Regular, Search20Regular, Settings20Regular, CalendarNote20Regular } from '@fluentui/react-icons';
import ProjectsArea from './ProjectsArea';
import { GlobalContext } from '../../App';
import { useNavigate } from 'react-router-dom';



export default function ContentArea() {

    const globalContext = useContext(GlobalContext)
    const navigate = useNavigate();

    return (
        <div className="content-area">
            
            <div className="items-start filter-bar">
               
               <div className='flex-row flex-wrap gap-5px'>
                    <Input 
                        className="search-input" 
                        contentBefore={<Search20Regular/>}
                        placeholder="بحث عن مشروع" 
                    />

                    <Dropdown placeholder="حدد الفئات" multiselect className="dropdown filter-input">
                        <Option>حاسب</Option>
                        <Option>إلكترونيات</Option>
                        <Option>طاقة</Option>
                    </Dropdown>

                    <Dropdown placeholder="التخصص" multiselect className="dropdown filter-input">
                        <Option>ذكاء اصطناعي</Option>
                        <Option>روبوتات</Option>
                        <Option>طاقة متجددة</Option>
                    </Dropdown>
                    
                    <Dropdown placeholder="الفصل" multiselect className="dropdown filter-input">
                        <Option>الفصل الأول </Option>
                        <Option>الفصل الثاني </Option>
                    </Dropdown>
                    
                    <Input type="text" placeholder='السنة' contentBefore={<CalendarNote20Regular/>}/>
               </div>

                {
                    globalContext.globalState.user? 
                    <UserBtn username={globalContext.globalState.user.name} isAdmin={true}/>
                    :
                    <Button
                        appearance='primary'
                        onClick={() => {
                            navigate('/Auth');
                        }}
                        style={{marginInlineStart: 'auto'}}
                    >تسجيل الدخول</Button>
                }
            </div>
            
            {/* Projects Area */}
            <ProjectsArea/>
        </div>
    );
}



function UserBtn({username, isAdmin}) {

    const navigate = useNavigate();

    return <Menu className='user-menu' positioning={{ autoSize: true, }}>
        <MenuTrigger disableButtonEnhancement>
            <MenuButton className='user-menu-btn' appearance="transparent">
                <div className='user-menu-btn-content'>
                    <Avatar className='user-menu-avatar' />
                    <div className='user-menu-name'>{username}</div>
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
    </Menu>;
}