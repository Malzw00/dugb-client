import { getCategoryProjects } from "@root/src/services/category";
import React, { useState } from "react";
import ProjectCard from "@PreMadeComponents/ProjectCard";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Display, tokens } from "@fluentui/react-components";
import Header from "./Header";

export default function CategoryPad({}) {

    const navigate = useNavigate();

    const { categoryId } = useParams();
    const [searchParams]  = useSearchParams();
    const projectId = searchParams.get('projectId')

    const [projects, setProjects] = useState([]);
    const [category, setCategory] = useState('');

    React.useEffect(() => {
        
        getCategoryProjects(categoryId)
            .then(res => {
                const category = res?.data?.result || [];
                const projects = category?.Projects || [];

                setCategory({
                    category_id: category.category_id,
                    category_name: category.category_name,
                    collage_id: category.collage_id,
                });

                setProjects(projects);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    return (
        <div className="content-area bg-3 height-100" style={{ overflow: 'auto' }}>

            <Header disableTabs onBackClick={() => navigate(-1)}/>

            <div className="categories-area" style={{ padding: '34px 10%', gap: '34px' }}>
                <Display><span style={{color:tokens.colorBrandBackground}}>
                    #{category?.category_name}
                </span></Display>

                <div className="projects-list">
                    {projects.map((project) => {
                        return <ProjectCard 
                            key={project.project_id} {...project} 
                            style={(parseInt(projectId) == project.project_id) && {
                                border: `1px solid ${tokens.colorBrandBackground}`
                            }}
                        />
                    })}
                </div>
            </div>
        </div>
    );
}