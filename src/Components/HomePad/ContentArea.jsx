import React from 'react';
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
    Image,
} from '@fluentui/react-components';
import { SignOut20Regular, Person20Regular, Search20Regular, Settings20Regular, CalendarNote20Regular } from '@fluentui/react-icons';
import ProjectsArea from '@components/HomePad/ProjectsArea';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectCategories } from '@root/src/store/slices/selectedCategories.slice';
import { setSearchText } from '@root/src/store/slices/searchProject.slice';
import { selectDepartment } from '@root/src/store/slices/selectedDepartment.slice';
import {  } from '@services/category';



export default function ContentArea() {

    const dispatch = useDispatch();

    const user = useSelector(state => state.user.value);
    const searchProject = useSelector(state => state.searchProject.value);
    const categories = useSelector(state => state.categories.value);
    const selectedCategories = useSelector(state => state.selectedCategories.value);
    const departments = useSelector(state => state.departments.value);
    const selectedDepartments = useSelector(state => state.selectedDepartment.value);

    const handleCategoriesSelect = (_, data) => {
        dispatch(selectCategories(data.selectedOptions)); 
    }

    const handleSearchInput = function (event) {
        dispatch(setSearchText(event.target.value));
    }

    const handleDepartmentSelect = function (event) {
        dispatch(selectDepartment(event.target.value));
    }

    React.useEffect(() => {
        // load and set categories
        

        // load and set departments
        // load and set user data
    }, []);

    const navigate = useNavigate();

    return (
        <div className="content-area">
            
            <div className="items-start filter-bar">
               
               <div className='flex-row flex-wrap gap-5px'>
                    <Input 
                        className="search-input" 
                        contentBefore={<Search20Regular/>}
                        placeholder="بحث عن مشروع" 
                        value={searchProject}
                        onChange={handleSearchInput}
                    />

                    <CategoriesDropdown
                        categories={categories}
                        selectedCategories={selectedCategories}
                        onCategorySelect={handleCategoriesSelect}
                    />

                    <DepartmentsDropdown
                        departments={departments}
                        selectedDepartments={selectedDepartments}
                        onDepartmentSelect={handleDepartmentSelect}
                    />
                    
                    <Dropdown placeholder="الفصل" multiselect className="dropdown filter-input">
                        <Option value='spring'>الربيع</Option>
                        <Option value='autumn'>الخريف</Option>
                    </Dropdown>
                    
                    <Input type="text" placeholder='السنة' contentBefore={<CalendarNote20Regular/>}/>
               </div>

                {
                    // globalContext.globalState.user? 
                    user.accountId?
                    <UserBtn 
                        username={`${user.fstName} ${user.lstName}`} 
                        isAdmin={user.role === 'admin' || user.role === 'manager'}
                        img={user.image}
                    />
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



function UserBtn({username, isAdmin, img}) {

    const navigate = useNavigate();

    return <Menu className='user-menu' positioning={{ autoSize: true, }}>
        <MenuTrigger disableButtonEnhancement>
            <MenuButton className='user-menu-btn' appearance="transparent">
                <div className='user-menu-btn-content'>
                    {/* <Avatar className='user-menu-avatar' /> */}
                    <Image src={img} width={34} style={{borderRadius: '50em'}} height={34}></Image>
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

function CategoriesDropdown({ categories, selectedCategories, onCategorySelect }) {

    return <Dropdown 
        multiselect
        className="dropdown filter-input"
        placeholder="تحديد الفئات" 
        selectedOptions={selectedCategories} 
        onOptionSelect={onCategorySelect}>

        <Option key={0} value={0}>كل الفئات</Option>
        {categories.map(category => {
            return <Option key={category.category_id} value={category.category_id}>
                {category.category_name}
            </Option>
        })}
    </Dropdown>
}

function DepartmentsDropdown({ departments, selectedDepartment, onDepartmentSelect }) {

    return <Dropdown 
        className="dropdown filter-input"
        placeholder="تحديد القسم" 
        selectedOptions={selectedDepartment}
        onOptionSelect={onDepartmentSelect}>

        <Option key={0} value={0}>كل الأقسام</Option>
        {departments.map(department => {
            return <Option key={department.department_id} value={department.department_id}>
                {department.department_name}
            </Option>
        })}
    </Dropdown>
}