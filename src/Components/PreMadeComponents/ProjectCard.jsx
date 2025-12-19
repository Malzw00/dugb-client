import { useNavigate } from 'react-router-dom';
import projectIcon from '@resources/book.svg'
import { Chat16Regular, Heart16Regular, Star16Regular } from '@fluentui/react-icons';


const reactionDivStyle = (`
    flex-row 
    bg-3 
    paddingY-2px
    paddingX-5px
    justify-center
    items-center 
    text-center 
    border-radius-5px
    gap-13px`
);

export default function ProjectCard({ 
    project_id, project_title, project_description, stats, iconWidth=100,
    titleStyle='header', // | 'paragraph'
    project_placeholder=''
}) {

    return (
        <a
            key={project_id}
            className='flex-row project-card padding-13px gap-13px'
            href={`/home/projects/${project_id}`}
            style={{textDecoration: 'none', color:'black'}}
        >
            <img 
                className="project-card-cover border-radius-4px" 
                src={projectIcon} 
                alt="Project Cover" 
                style={{ width: `${iconWidth}px` }}
            />

            <div className="flex-col project-details-div gap-8px">
                
                {titleStyle === 'header' && <h2 className='project-title-h2'>{project_title}</h2>}
                {titleStyle === 'paragraph' && <div>
                    <p>{project_title}</p>
                    <p style={{color: 'gray'}}>{project_placeholder}</p>
                </div>}
                
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