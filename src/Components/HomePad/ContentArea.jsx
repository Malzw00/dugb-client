import React from 'react';
import {
    Input,
    Dropdown,
    Option,
    Button,
} from '@fluentui/react-components';
import { Dismiss16Regular, Search20Regular, } from '@fluentui/react-icons';
import ProjectsArea from '@components/HomePad/ProjectsArea';
import { useDispatch, useSelector } from 'react-redux';
import { selectCategory } from '@root/src/store/slices/selectedCategory.slice';
import { setSearchText } from '@slices/searchProject.slice';
import { selectDepartment } from '@slices/selectedDepartment.slice';
import { getCategories } from '@services/category';
import { setCategories } from '@slices/categories.slice';
import { getDepartments } from '@services/collage';
import { setDepartments } from '@slices/departments.slice';
import { UserBtn } from '@components/HomePad/UserBtn';
import { setFrom, setTo } from '@root/src/store/slices/dateFilter.slice';
import { setSemester } from '@root/src/store/slices/semester.slice';



export default function ContentArea() {

    const dispatch = useDispatch();

    const searchProject = useSelector(state => state.searchProject.value);
    const departments = useSelector(state => state.departments.value);
    const semester = useSelector(state => state.semester.value);
    const selectedCollage = useSelector(state => state.selectedCollage.value);
    const selectedDepartment = useSelector(state => state.selectedDepartment.value);

    const handleSearchInput = function (event) {
        dispatch(setSearchText(event.target.value));
    }

    const handleDepartmentSelect = function (_, data) {
        dispatch(selectDepartment(data.selectedOptions));
    }

    const handleSemesterSelect = function (event, data) {
        dispatch(setSemester(data.selectedOptions[0]));
    }
    
    const handleUnSelectSemester = function (_) {
        dispatch(setSemester(null));
    }

    const handleUnSelectDepartment = function (_) {
        dispatch(selectDepartment([]));
    }

    React.useEffect(() => {

        // load and set categories
        getCategories({ collageId: selectedCollage }).then(res => {
          
            const categories = res?.data?.result?? [];
            
            dispatch(setCategories(categories));
            
            dispatch(selectCategory(categories?.[0].category_id?? 0));
        
        }).catch(err => {
          
            if(err.status === 404 || err.status === 400)
                dispatch(setCategories(0));
        });

        // load and set departments
        getDepartments(selectedCollage).then(res => {

            dispatch(setDepartments(res?.data?.result ?? []));
            
            dispatch(selectDepartment([]));

        }).catch(err => {
          
            if(err.status === 404 || err.status === 400)
                dispatch(setDepartments([]));
        });

    }, [selectedCollage]);

    return (
        <div className="content-area">
            
            <div className="flex-row justify-between">
                <div className="filter-div" style={{width: '60%', padding: '2px', height: 'fit-content'}}>
                    <Input 
                        className="search-input" 
                        contentBefore={<Search20Regular/>}
                        placeholder="بحث عن مشروع" 
                        value={searchProject}
                        style={{ flex: '1' }}
                        onChange={handleSearchInput}
                    />
                    <Button icon={<Dismiss16Regular/>} onClick={() => dispatch(setSearchText(''))}/>
                </div>
                {/* user button */}
                <UserBtn />
            </div>

            <div className='flex-row flex-wrap items-center gap-5px'>

                <DepartmentsDropdown
                    departments={departments}
                    selectedDepartment={selectedDepartment}
                    onDepartmentSelect={handleDepartmentSelect}
                    handleUnSelect={handleUnSelectDepartment}
                />
                
                <div className="filter-div">
                    <Dropdown  
                        selectedOptions={semester? [semester]: []}
                        onOptionSelect={handleSemesterSelect}
                        placeholder="الفصل" 
                        className="dropdown filter-input">

                        <Option value='spring'>الربيع</Option>
                        <Option value='autumn'>الخريف</Option>
                    </Dropdown>
                    <Button icon={<Dismiss16Regular/>} onClick={handleUnSelectSemester}/>
                </div>
            </div>
            
            {/* Projects Area */}
            <ProjectsArea/>
        </div>
    );
}

function CategoriesDropdown({ categories, selectedCategories, onCategorySelect, handleUnSelect }) {

    return <div className='filter-div'>
        <Dropdown 
            multiselect
            className="dropdown filter-input"
            placeholder="تحديد الفئات"
            selectedOptions={selectedCategories} 
            onOptionSelect={onCategorySelect}>

            {categories?.map?.((category, index) => {
                return <Option key={index} value={category.category_id}>
                    {category.category_name}
                </Option>
            })}
        </Dropdown>
        <Button icon={<Dismiss16Regular/>} onClick={handleUnSelect}/>
    </div>
}

function DepartmentsDropdown({ departments, selectedDepartment, onDepartmentSelect, handleUnSelect }) {

    return <div className='filter-div'>
        <Dropdown 
            className="dropdown filter-input"
            placeholder="تحديد القسم" 
            selectedOptions={selectedDepartment}
            onOptionSelect={onDepartmentSelect}>

            {departments.map((department, index) => {
                return <Option key={index} value={department.department_id}>
                    {department.department_name}
                </Option>
            })}
        </Dropdown>
        <Button icon={<Dismiss16Regular/>} onClick={handleUnSelect}/>
    </div>
}


function DateFilter () {

    const dispatch = useDispatch();
    
    const dateFilter = useSelector(state => state.dateFilter.value);

    const handleFromDateChange = (event) => {
        dispatch(setFrom(event.target.value));
    };

    const handleToDateChange = (event) => {
        dispatch(setTo(event.target.value));
    };

    return <div className="filter-div">
        
        <span style={{ fontSize: '14px', padding: '0 8px' }}>التاريخ من:</span>
        
        <Input 
            className='date-box' 
            type="date" 
            value={dateFilter.from}
            onChange={handleFromDateChange}
        />
        
        <span style={{ fontSize: '14px', padding: '0 8px' }}>إلى:</span>

        <Input 
            className='date-box' 
            type="date" 
            value={dateFilter.to} 
            onChange={handleToDateChange}
        />
    </div>
}