import { useNavigate } from 'react-router-dom';
import projectIcon from '@resources/book.svg'
import { Chat16Regular, Heart16Regular, Star16Regular } from '@fluentui/react-icons';


const reactionDivStyle = (`
    flex-row  
    paddingY-2px
    paddingX-5px
    justify-center
    items-center 
    text-center 
    border-radius-5px
    gap-13px
    bg-2`
);

export default function ProjectCard({ 
    project_id, 
    project_title, 
    project_description, 
    stats, 
    iconWidth=100,
    titleStyle='header', // | 'paragraph'
    project_placeholder='',
    project_date,
    project_semester,
    style,
}) {

    return (
        <a
            key={project_id}
            className='flex-row project-card padding-13px gap-13px'
            href={`/home/projects/${project_id}`}
            style={{textDecoration: 'none', color:'black', ...(style?? {}) }}
        >
            <img 
                className="project-card-cover border-radius-4px" 
                src={projectIcon} 
                alt="Project Cover" 
                style={{ width: `${iconWidth}px` }}
            />

            <div className="flex-col project-details-div gap-8px">
                
                <div className='flex-row gap-8px'>
                    {titleStyle === 'header' && <h2 className='project-title-h2'>{project_title}</h2>}
                    {titleStyle === 'paragraph' && <>
                        <p>{project_title}</p>
                        <p style={{color: 'gray'}}>{project_placeholder}</p>
                    </>}
                    <span className='project-date' style={{ fontSize: '12px' }}>
                        {project_semester === 'Spring'? 'ربيع': 'خريف'} {new Date(project_date).getFullYear()}
                    </span>
                </div>
                
                <p>{project_description}</p>               

                {stats && <div className='flex-row gap-5px'>
                    <div className={reactionDivStyle} style={{ border: '1px solid silver' }}>
                        <Heart16Regular/>{stats?.likes?? '0'}
                    </div>
                    <div className={reactionDivStyle} style={{ border: '1px solid silver' }}>
                        <Chat16Regular/>{stats?.comments?? '0'}
                    </div>
                    <div className={reactionDivStyle} style={{ border: '1px solid silver' }}>
                        <Star16Regular/>{stats?.rating?? '0'}
                    </div>
                </div>}
            </div>
        </a>
    );
};