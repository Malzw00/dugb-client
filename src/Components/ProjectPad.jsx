import { 
    Button, 
    Menu,
    MenuTrigger,
    MenuButton,
    MenuPopover,
    MenuList,
    MenuItem, Slider, 
    Tooltip
} from "@fluentui/react-components";
import { 
    ArrowDown20Regular, 
    Attach20Regular, 
    Chat20Regular, 
    Heart20Regular, 
    List20Regular, 
    Person20Regular, 
    TextDescription20Regular 
} from "@fluentui/react-icons";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import '@styles/ProjectPad.css'
import PlatformHeader from "@components/PreMadeComponents/PlatformHeader";
import { getProjectById } from "../services/project/project";
import bookImg from '@resources/book.svg'



export default function ProjectPad() {

    const { projectId } = useParams();
    const [project, setProject] = useState(null);

    React.useEffect(() => {

        getProjectById(projectId).then(res => {

            if(res?.data?.success){
                const resProject = res?.data?.result;

                if(resProject)
                setProject(resProject);
            }

        }).catch(err => {
            setProject(null);
        })

    }, [])
    
    return ( 
        project
        ? <div 
            className="flex-col project-float-pad height-full width-full" 
            style={{background: 'white'}}
        >
            {/* Platform Header */}
            <PlatformHeader/>

            {/* project Content Area */}
            <div className='flex-row flex-grow overflow-auto project-content-area min-height-0'>

                {/** cover side */}
                <CoverSide projImgPath={bookImg}/>

                {/** project details section */}
                <div className='flex-col flex-grow overflow-auto project-details-section bg-1 gap-13px padding-34px'>

                    {/* Title Description Section */}
                    <TitleDescriptionSection 
                        title={project.project_title} 
                        description={project.project_description}
                    />

                    {/** separator */}
                    <div style={{height: '13px'}}/>

                    {/* Details Section */}
                    <DetailsSection project={project}/>
                    
                    {/** separator */}
                    <div style={{height: '13px'}}/>

                    {/* Developers Section */}
                    <StudentsSection students={project.Students}/>

                    {/* Supervisor Section */}
                    <SupervisorSection supervisor={project.Supervisor}/>

                    {/* Float Action Buttons */}
                    <div 
                        className='flex-row float-action-btns pos-fixed gap-8px' 
                        style={{bottom: '34px', left: '34px'}}
                    >
                        <CircleButton tiptext={`التعليقات`}>
                            <Chat20Regular/>
                        </CircleButton>
                        <CircleButton tiptext={`إعجاب`}>
                            <Heart20Regular/>
                        </CircleButton>
                        <ProjectOptionsMenu tiptext={`خيارات أخرى`}/>
                    </div>
                    
                </div>
            </div>
        </div>
        : <div className="not-found-div">404 Not Found</div>
    );
}




// -----------------------------------------------------------------------------
// Component: CoverSide
function CoverSide({projImgPath}) {
    return <div className='block cover-side height-full padding-13px'>
        <img
            className="block border-radius-8px"
            src={projImgPath}
            alt="project cover" 
        />
        
        {/* هذا الزر يضهر ديالوق فيه خيارين واحد لتنزيل الكتاب والآخر للعرض التقديمي */}
        <Button appearance="primary" style={{
            display: 'flex',
            gap: '8px', position: 'fixed', bottom: '34px', right: '34px',
            minHeight: '44px', width: '44px', minWidth: '44px', height: '44px', padding: '0',
            alignSelf: 'end', borderRadius: '50em', boxShadow: '0 0 6px rgba(0,0,0,0.2)'
        }}>
            <ArrowDown20Regular /> 
        </Button>
    </div>;
}



// -----------------------------------------------------------------------------
// Component: TitleDescriptionSection
function TitleDescriptionSection({title, description}) {

    const [rate, setRate] = useState(0);

    return <div style={{maxWidth: '80%'}} className="flex-col gap-13px">
        
        <div className="flex-row items-center justify-between gap-8px">
            <h1>{title}</h1>
        </div>
        
        <div><p>{description}</p></div>

        <div className={`
                flex-row 
                gap-0px 
                width-100 
                items-center 
                bg-3 
                border-radius-5px 
                padding-5px
                paddingX-21px
            `}
            style={{ border: '1px solid silver'}}>

            <span>تقييم المشروع</span>
            <Slider 
                max={5}  
                value={rate}
                style={{width: '100px', padding: '0'}}
                onChange={(ev)=>setRate(ev.target.value)}
            />
            <span>5/{rate}</span>
        </div>
    </div>;
}



// -----------------------------------------------------------------------------
// Component: DetailsSection
function DetailsSection({ project }) {

    return <div className='flex-col details-section gap-13px'>

        <div className="flex-row detail-section collage-section gap-13px">
            <h3 style={{ color: 'rgba(0, 0, 0, 0.8)' }}>الكلية</h3>
            <p>{project.Department.Collage.collage_name}</p>
        </div>

        <div className="flex-row detail-section major-section gap-13px">
            <h3 style={{ color: 'rgba(0, 0, 0, 0.8)' }}>الفصل الدراسي</h3>
            <p>{project.project_semester}</p>
        </div>

        <div className="flex-row detail-section major-section gap-13px">
            <h3 style={{ color: 'rgba(0, 0, 0, 0.8)' }}>القسم</h3>
            <p>{project.Department.department_name}</p>
        </div>

        <div className="flex-row detail-section major-section gap-13px">
            <h3 style={{ color: 'rgba(0, 0, 0, 0.8)' }}>تاريخ المشروع</h3>
            <p>{new Date(project.project_date).toISOString().slice(0, 10)}</p>
        </div>

        {/* <CategoriesSection categories={categories}/> */}

        {/* <KeywordsSection keywords={keywords}/> */}

    </div>
}


// -----------------------------------------------------------------------------
// Component: KeywordsSection
function KeywordsSection({keywords}) {    

    return <div className="flex-row detail-section keywords-section gap-13px">
        <h3 style={{ color: 'rgba(0, 0, 0, 0.8)' }}>الكلمات المفتاحية</h3>
        <div className="flex-row gap-3px">
            {keywords.map((keyword, index) => {
                return <span key={index} className='proj-keyword-span'>{keyword}</span>;
            })}
        </div>
    </div>;
}

// -----------------------------------------------------------------------------
// Component: CategoriesSection
function CategoriesSection({categories}) {

    return <div className="flex-row detail-section categories-section gap-13px">
        <h3 style={{ color: 'rgba(0, 0, 0, 0.8)' }}>الفئات</h3>
        <div className="flex-row gap-3px">{categories.map((category) => {
            return <span className='cursor-pointer proj-category-span'>{category}</span>;
        })}</div>
    </div>;
}



// -----------------------------------------------------------------------------
// Component: DevelopersSection
function StudentsSection({ students }) {
    return students?.length && <span className="flex-col data-section developers-section gap-13px">
        <h3>إعداد الطلبة</h3>
        <div className='flex-row flex-wrap gap-8px'>{students.map((student, index) => {
            return <Button 
                key={index}
                appearance="primary"
                style={{
                    padding: '3px 8px',
                    width: 'fit-content',
                    display: 'flex',
                    justifyContent: 'start',
                    gap: '8px',
                }}
            >
                <Person20Regular /> {student.student_name}
            </Button>;
        })}</div>
    </span>;
}

// -----------------------------------------------------------------------------
// Component: SupervisorSection
function SupervisorSection({ supervisor }) {

    return supervisor && <span className="flex-col data-section developers-section gap-13px">
        <h3>تحت إشراف</h3>
        <Button
            appearance="primary"
            style={{
                padding: '3px 8px',
                width: 'fit-content',
                display: 'flex',
                justifyContent: 'start',
                gap: '8px',
            }}
        >
            <Person20Regular /> {supervisor.supervisor_name}
        </Button>
    </span>;
}

// -----------------------------------------------------------------------------
// Component: CircleButton
function CircleButton (props) {

    return (
        <Tooltip content={props.tiptext} children={
            <Button appearance="primary" style={{ 
                display: 'flex',
                gap: '8px', borderRadius: '50em', 
                minHeight: '40px', padding: '0',
                minWidth: '40px'
            }} {...props}>
                {props.children?? ''}
            </Button>
        }/>
    )
}


// -----------------------------------------------------------------------------
// Component: ProjectOptionsMenu
function ProjectOptionsMenu({ tiptext }) {
    return (
        <Menu title={tiptext} className='project-options-menu'>
            <MenuTrigger disableButtonEnhancement>
                <MenuButton 
                    className='project-options-menu-btn' 
                    style={{
                        display: 'flex',
                        gap: '8px', borderRadius: '50em', 
                        minHeight: '40px', padding: '0',
                        minWidth: '40px'
                    }} 
                    appearance="primary" 
                    icon={<List20Regular/>}
                />
            </MenuTrigger>
            <MenuPopover>
                <MenuList>
                    <MenuItem
                        icon={<TextDescription20Regular/>}
                        onClick={() => {
                            // TODO: handle logout
                        }}
                    >
                        الملخص
                    </MenuItem>

                    <MenuItem
                        icon={<Attach20Regular/>}
                        onClick={() => {
                            // TODO: handle logout
                        }}
                    >
                        المراجع
                    </MenuItem>
                </MenuList>
            </MenuPopover>
        </Menu>
    );
}