import { 
    Button, 
    Accordion,
    AccordionItem,
    AccordionHeader,
    AccordionPanel,
    tokens,
    Rating
} from "@fluentui/react-components";
import { 
    Chat24Regular,  
    Heart24Regular, 
} from "@fluentui/react-icons";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import '@styles/ProjectPad.css'
import PlatformHeader from "@components/PreMadeComponents/PlatformHeader";
import { getProjectById } from "@services/project/project";
import bookImg from '@resources/book.svg'
import { useDispatch } from "react-redux";
import { selectHeaderTab } from "@slices/selectedHeaderTab.slice";
import { selectCategory } from "@slices/selectedCategory.slice";
import { selectCollage } from "@slices/selectedCollage.slice";



export default function ProjectPad() {

    const { projectId } = useParams();
    const [project, setProject] = useState(null);

    React.useEffect(() => {
        getProjectById(projectId)
            .then(res => {
                if(res?.data?.success){
                    const resProject = res?.data?.result;

                    if(resProject)
                    setProject(resProject);

                    console.log(resProject);                    
                }
            })
            .catch(err => {
                console.log(err);
            });
    }, []);
    
    return ( 
        project && <div 
            className="flex-col project-float-pad height-full width-full" 
            style={{background: 'white'}}
        >
            {/* Platform Header */}
            <PlatformHeader/>

            {/* project Content Area */}
            <div className='flex-row flex-grow overflow-auto project-content-area min-height-0'>

                {/** cover side */}
                <SideBar projImgPath={bookImg}/>

                {/** project details section */}
                <div 
                    className='flex-col flex-grow overflow-auto project-details-section bg-1 gap-13px padding-34px'
                    style={{paddingBottom: '189px'}}>

                    {/* Project Header */}
                    <ProjectHeader 
                        title={project.project_title} 
                        updatedAt={project.updatedAt}
                        description={project.project_description}
                        date={project.project_date}
                        semester={project.project_semester}
                        grade={project.project_grade}
                        department={project.Department}
                        collage={project.Department?.Collage}
                    />

                    {/* Project Body */}
                    <ProjectBody
                        supervisor={project.Supervisor}
                        students={project.Students}
                        keywords={project.Keywords}
                        categories={project.Categories}
                    />
                
                </div>
            </div>
        </div> || <></>
    );
}




// -----------------------------------------------------------------------------
// Component: CoverSide
function SideBar({projImgPath}) {
    const reactionBtnsStyle = {
        borderRadius: '50em',
        // minWidth: '0px',
        minWidth: '44px',
        height: '44px',
        display: 'flex',
        gap: '13px'
    }
    return <div className='flex-col cover-side height-full padding-13px gap-5px'>
        <img
            className="block border-radius-8px"
            src={projImgPath}
            alt="project cover" 
        />

        <RatingRange/>
        
        <Button appearance="primary">كتاب المشروع</Button>
        
        <Button appearance="primary">العرض التقديمي</Button>
        
        <Button appearance="primary">المراجع</Button>
        
        <div className="flex-row gap-5px" style={{marginTop: 'auto'}}>
            <Button appearance="primary" style={reactionBtnsStyle}>
                <Heart24Regular/>
            </Button>
            <Button appearance="primary" style={reactionBtnsStyle}>
                <Chat24Regular/> <span>التعليقات</span>
            </Button>
        </div>
    </div>;
}



// -----------------------------------------------------------------------------
// Component: TitleDescriptionSection
function ProjectHeader({ title, description, updatedAt, date, semester, grade, department, collage }) {

    return <div className="flex-col gap-13px" style={{ width: '80%' }}>
        
        <div className="flex-row items-center justify-between gap-8px" style={{ lineHeight: '44px' }}>
            <h1>{title}</h1>
        </div>

        <div><p style={{ fontSize:'16px', lineHeight:'25px' }}>{description}</p></div>
        
        <div className="flex-col" style={{fontSize:'12px'}}>
            {(collage && department) && <span>
                كلية {collage.collage_name} قسم {department.department_name}
            </span>}
            {(date && semester) && <span>
                تم إنشاء المشروع سنة {new Date(date).getFullYear()} فصل 
                {semester.toLowerCase() === 'spring' && <span> الربيع</span>} 
                {semester.toLowerCase() === 'autumn' && <span> الخريف</span>} 
            </span>}
            
            {updatedAt && <span style={{ color:'gray' }}>
                آخر تحديث: {new Date(updatedAt).toISOString().slice(0, 10)}
            </span>}
        </div>

        {grade && <div className="bg-3" style={{
            width:'fit-content',
            border: '1px solid silver',
            padding: '3px 13px',
            borderRadius: '50em'
        }}>
            <span style={{ fontWeight:'bold' }}>الدرجة:</span>
            <span> </span>
            <span>{grade}</span>
        </div>}
    </div>;
}



function RatingRange() {

    const [rate, setRate] = useState(0);

    return <div className={`
            flex-row 
            gap-0px 
            width-100 
            items-center 
            justify-center
            padding-5px
            paddingX-21px
        `}>

        <Rating 
            value={rate} 
            onChange={(_, data) => {setRate(data.value)}}
        />

    </div>
}



function ProjectBody ({ students=[], supervisor, keywords=[], categories=[]  }) {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const itemStyle = {
        borderRadius: '8px',
        padding: '3px 5px',
        background: tokens.colorNeutralBackground2,
        border: `1px solid ${tokens.colorNeutralStroke1}`,
        width: 'max-content'
    } 

    const placeholderStyle = {
        fontSize: '12px',
        color: 'gray'
    }

    const panelStyle = {
        background: tokens.colorNeutralBackground3,
        borderRadius: '13px',
        padding: '13px',
        border: `1px solid ${tokens.colorNeutralStroke2}`
    }

    const handleCategoryClick = function (category) {
        return () => {
            dispatch(selectHeaderTab('categories'));
            dispatch(selectCollage(category.collage_id));
            dispatch(selectCategory(category.category_id));
            navigate('/home');
        }
    }
    
    return (
        <div className="flex-col gap-8px" style={{ width: '80%' }}>

            <Accordion multiple>
                
                <AccordionItem value={'supervisor'}>
                    <AccordionHeader size='medium'>المشرف</AccordionHeader>
                    <AccordionPanel style={panelStyle}>
                        {supervisor && <div>
                            {supervisor.supervisor_title}. {supervisor.supervisor_full_name}
                        </div>}
                        {!supervisor && <div style={placeholderStyle}>
                            لم يتم توثيق بيانات المشرف بعد
                        </div>}
                    </AccordionPanel>
                </AccordionItem>
                
                <AccordionItem value={'students'}>
                    <AccordionHeader size='medium'>إعداد الطلبة</AccordionHeader>
                    <AccordionPanel style={panelStyle}>
                        <div className="flex-col items-stretch gap-5px" style={{minWidth:'200px'}}>
                            {students.map((student, i) => {
                                return <div key={i} style={{ padding: '5px', width: '100%'}}>
                                    {student.student_full_name}
                                </div>
                            })}
                            {(students.length < 1) && <div style={placeholderStyle}>
                                لم يتم توثيق بيانات الطلبة بعد
                            </div>}
                        </div>
                    </AccordionPanel>
                </AccordionItem>
                
                <AccordionItem value={'keywords'}>
                    <AccordionHeader size='medium'>الكلمات المفتاحية</AccordionHeader>
                    <AccordionPanel style={{ ...panelStyle, display:'flex', flexWrap:'wrap', gap:'5px' }}>
                        {keywords.map((keyword, i) => {
                            return <div key={i} style={itemStyle}>
                                {keyword.keyword}
                            </div>
                        })}
                        {(keywords.length < 1) && <div style={placeholderStyle}>
                            لم يتم تحديد الكلمات المفتاحية بعد
                        </div>}
                    </AccordionPanel>
                </AccordionItem>
                
                <AccordionItem value={'categories'}>
                    <AccordionHeader size='medium'>الفئات</AccordionHeader>
                    <AccordionPanel style={{ ...panelStyle, display:'flex', flexWrap:'wrap', gap:'5px' }}>
                        {categories.map((category, i) => {
                            return <div 
                                key={i} style={{...itemStyle, cursor: 'pointer' }} 
                                onClick={handleCategoryClick(category)}>
                                    
                                {category.category_name}
                            </div>
                        })}
                        {(categories.length < 1) && <div style={placeholderStyle}>
                            لم يتم تحديد الفئات بعد
                        </div>}
                    </AccordionPanel>
                </AccordionItem>
            
            </Accordion>
        </div>
    );
}