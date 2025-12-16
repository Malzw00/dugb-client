import { Tab, TabList } from "@fluentui/react-components";
import ProjectCard from "@components/PreMadeComponents/ProjectCard";
import { useDispatch, useSelector } from "react-redux";
import { orderDict, setOrder } from "@root/src/store/slices/order.slice";
import React from "react";
import { getProjects } from "@root/src/services/project/project";
import { setProjects } from "@root/src/store/slices/projects.slice";


export default function ProjectsArea() {

    const dispatch = useDispatch();

    const projects = useSelector(state => state.projects.value);
    const dateFilter = useSelector(state => state.dateFilter.value);
    const selectedDepartment = useSelector(state => state.selectedDepartment.value);
    const semester = useSelector(state => state.semester.value);
    const order = useSelector(state => state.order.value);
    const selectedCollage = useSelector(state => state.selectedCollage.value);
    // const selectedCategories = useSelector(state => state.selectedCategories.value);

    const handleOrderSelected = function (_, data) {
        dispatch(setOrder(data.value));
    }

    React.useEffect(() => {
        getProjects({
            // categories: selectedCategories,
            collageId: selectedCollage,
            sortBy: orderDict[order][0],
            order: orderDict[order][1],
            departmentId: selectedDepartment[0],
            semester,
            offset: 0,
            limit: 50
        }).then(res => {
            dispatch(setProjects(res.data.result.projects?? []));
        });
    }, [ selectedDepartment, semester, order, selectedCollage, dateFilter, ]);

    return <div className='projects-area min-height-0'>
        
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

        <div className="projects-list height-full overflowY-auto min-height-0">
            {projects.map((project, index) => (
                <ProjectCard key={index} {...project}/>
            ))}
        </div>
    </div>
}