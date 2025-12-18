import { getCategoryProjects } from "@root/src/services/category";
import { setProjects } from "@root/src/store/slices/projects.slice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ProjectCard from "@PreMadeComponents/ProjectCard";

export default function CategoriesContentArea({}) {

    const dispatch = useDispatch();

    const projects = useSelector(state => state.projects.value);
    const selectedCategory = useSelector(state => state.selectedCategory.value);

    React.useEffect(() => {
        
        getCategoryProjects(selectedCategory)
            .then(res => {
                const projects = res?.data?.result || [];
                dispatch(setProjects(projects));
            })
            .catch(err => {
                console.log(err);
            });

    }, [selectedCategory,])

    return (
        <div className="content-area">
            <div className="projects-area">
                <div className="projects-list">
                    {projects.map((project, index) => {
                        return <ProjectCard key={index} {...project}/>
                    })}
                </div>
            </div>
        </div>
    );
}