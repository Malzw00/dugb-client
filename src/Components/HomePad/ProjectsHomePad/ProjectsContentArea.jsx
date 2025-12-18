import React from 'react';
import {
    Input,
    Dropdown,
    Option,
    Button,
} from '@fluentui/react-components';
import { Dismiss16Regular, Search20Regular, } from '@fluentui/react-icons';
import ProjectsArea from '@components/HomePad/ProjectsHomePad/ProjectsArea';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchText } from '@slices/searchProject.slice';
import { selectDepartment } from '@slices/selectedDepartment.slice';
import { getDepartments } from '@services/collage';
import { setDepartments } from '@slices/departments.slice';
import { setSemester } from '@slices/semester.slice';



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
            
            <div className="flex-row justify-start gap-8px">
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