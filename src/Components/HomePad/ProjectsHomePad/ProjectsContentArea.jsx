import React from 'react';
import {
    Input,
    Dropdown,
    Option,
    Button,
    TabList,
    Tab,
} from '@fluentui/react-components';
import { Dismiss16Regular, } from '@fluentui/react-icons';
import ProjectsArea from '@components/HomePad/ProjectsHomePad/ProjectsArea';
import { useDispatch, useSelector } from 'react-redux';
import { selectDepartment } from '@slices/selectedDepartment.slice';
import { getDepartments } from '@services/collage';
import { setDepartments } from '@slices/departments.slice';
import { setSemester } from '@slices/semester.slice';
import { setOrder } from '@root/src/store/slices/order.slice';



export default function ProjectsContentArea() {

    const dispatch = useDispatch();
    
    const departments = useSelector(state => state.departments.value);
    const semester = useSelector(state => state.semester.value);
    const selectedCollage = useSelector(state => state.selectedCollage.value);
    const selectedDepartment = useSelector(state => state.selectedDepartment.value);
    const order = useSelector(state => state.order.value);
    
    const handleOrderSelected = function (_, data) {
        dispatch(setOrder(data.value));
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

            <TabList 
                vertical={false} 
                className="ranks-bar"
                selectedValue={order}
                onTabSelect={handleOrderSelected}>

                <Tab key={1} className='rank-tab' value={'latest'}>الأحدث</Tab>
                <Tab key={2} className='rank-tab' value={'oldest'}>الأقدم</Tab>
                <Tab key={3} className='rank-tab' value={'topRated'}>الأعلى تقييما</Tab>
                <Tab key={4} className='rank-tab' value={'lowRated'}>الأقل تقييما</Tab>
                <Tab key={5} className='rank-tab' value={'topLiked'}>الأكثر إعجابا</Tab>
                <Tab key={6} className='rank-tab' value={'lowLiked'}>الأقل إعجابا</Tab>
            </TabList>
            
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