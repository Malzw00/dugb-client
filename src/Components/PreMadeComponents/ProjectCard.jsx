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

export default function ProjectCard({ project_id, project_title, project_description, stats, style}) 
    {

    const navigate = useNavigate();

    return (
        <a
            key={project_id}
            className='project-card flex-row padding-13px gap-13px'
            onClick={() => {
                navigate(`/home/project/${project_id}`);
            }}
            style={style?? {}}
        >
            <img 
                className="project-card-cover border-radius-4px" 
                src={projectIcon} 
                alt="Project Cover" 
                style={{ width: '100px' }}
            />

            <div className="project-details-div flex-col gap-8px">
                
                <h2 className='project-title-h2'>{project_title}</h2>
                
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