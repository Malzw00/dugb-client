import { Spinner, } from "@fluentui/react-components";
import ProjectCard from "@components/PreMadeComponents/ProjectCard";
import { useDispatch, useSelector } from "react-redux";
import { orderDict } from "@root/src/store/slices/order.slice";
import React, { useState } from "react";
import { getProjects } from "@root/src/services/project/project";
import { setProjects } from "@root/src/store/slices/projects.slice";


export default function ProjectsArea() {

    const dispatch = useDispatch();

    const projects = useSelector(state => state.projects.value);
    const order = useSelector(state => state.order.value);
    const semester = useSelector(state => state.semester.value);
    const selectedCollage = useSelector(state => state.selectedCollage.value);
    const selectedDepartment = useSelector(state => state.selectedDepartment.value);
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {

        setLoading(true);
        
        getProjects({
            collageId: selectedCollage,
            sortBy: orderDict[order][0],
            order: orderDict[order][1],
            departmentId: selectedDepartment[0],
            semester,
            offset: 0,
            limit: 50
        }).then(res => {
            dispatch(setProjects(res.data.result.projects?? []));
            setLoading(false);
        });
    }, [ selectedDepartment, semester, order, selectedCollage, ]);

    return <div className='projects-area min-height-0'>

        <div className={`projects-list ${projects.length < 1 && 'justify-center items-center'}`}>
            {loading && <Spinner className="spinner"/> ||
            projects.map((project, index) => (
                <ProjectCard key={index} {...project}/>
            ))}
        </div>
    </div>
}