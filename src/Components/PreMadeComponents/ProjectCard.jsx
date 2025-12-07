import { Label } from "@fluentui/react-components";
import { useNavigate } from 'react-router-dom';
import projectImg from '@resources/book.png'



export default function ProjectCard({ project_title, project_description, developers = [], categories = [], 
        keywords = [], cover_image_id, supervisor, project_id, style}) 
    {

    const navigate = useNavigate();

    return (
        <a
            className='project-card flex-row padding-13px gap-13px'
            onClick={() => {
                navigate(`/home/project/${project_id}`);
            }}
            style={style?? {}}
        >
            <img 
                className="project-card-cover border-radius-4px" 
                src={projectImg} 
                alt="Project Cover" 
                style={{background: 'rgba(0, 0, 0, 0.2)', height: '260px', width: '188px'}}
            />

            <div className="project-details-div flex-col gap-8px">
                
                <h2>{project_title}</h2>
                
                <p>{project_description}</p>

                {/* <span className="flex-col gap-5px"> 
                    <h4>إعداد الطلبة</h4> 
                    <div className='flex-row flex-wrap gap-5px'>
                        {developers.map(dever => <Label>{dever}</Label>)}
                    </div>
                </span> */}

                {/* <span className="flex-col gap-5px"> 
                    <h4>تحت إشراف</h4> 
                    <div className='flex-row flex-wrap gap-5px'>
                        <Label>{supervisor}</Label>
                    </div>
                </span> */}
                
                {/* <div className="categories-section flex-row gap-8px">
                    <h5 style={{color: 'rgba(0, 0, 0, 0.8)'}}>الفئات</h5>
                    <div className="flex-row gap-3px">
                        {categories.map((category) => <span className='proj-category-span'>{category}</span>)}
                    </div>
                </div>
                
                <div className="keywords-section flex-row gap-8px">
                    <h5 style={{color: 'rgba(0, 0, 0, 0.8)'}}>الكلمات المفتاحية</h5>
                    <div className="flex-row gap-3px">
                        {keywords.map((keyword) => <span className='proj-keyword-span'>{keyword}</span>)}
                    </div>
                </div> */}
            </div>
        </a>
    );
};