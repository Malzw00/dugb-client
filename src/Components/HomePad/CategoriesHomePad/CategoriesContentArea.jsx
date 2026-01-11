import { getCategoryProjects } from "@root/src/services/category";
import { setProjects } from "@root/src/store/slices/projects.slice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProjectCard from "@PreMadeComponents/ProjectCard";
import { Display, Title1, Title3, tokens } from "@fluentui/react-components";

export default function CategoriesContentArea({}) {

    const dispatch = useDispatch();

    const projects = useSelector(state => state.projects.value);
    const selectedCategory = useSelector(state => state.selectedCategory.value);
    const [category, setCategory] = useState(null);

    React.useEffect(() => {
        
        getCategoryProjects(selectedCategory)
            .then(res => {
                const category = res?.data?.result || null;
                const projects = category?.Projects || [];
                setCategory(category);
                dispatch(setProjects(projects));
            })
            .catch(err => {
                console.log(err);
            });

    }, [selectedCategory,]);

    return (
        <div className="content-area">
            <Title1 style={{padding: '13px'}}>
                <span style={{color: tokens.colorBrandBackground}}>
                    #{category?.category_name}
                </span>
            </Title1>
            <div className="categories-area">
                <div className="projects-list">
                    {projects.map((project, index) => {
                        return <ProjectCard key={index} {...project}/>
                    })}
                </div>
            </div>
        </div>
    );
}