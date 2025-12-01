import { 
    Button, 
    Menu,
    MenuTrigger,
    MenuButton,
    MenuPopover,
    MenuList,
    MenuItem, Slider 
} from "@fluentui/react-components";
import { ArrowDown20Regular, ArrowRight20Regular, Attach20Regular, Book20Regular, Chat20Regular, Heart20Regular, Library20Regular, List20Regular, Person20Regular, TextDescription20Regular } from "@fluentui/react-icons";
import Header from "./PreMadeComponents/Header";
import { useContext, useState } from "react";
import { HomePadContext } from "./HomePad/HomePad";
import { useNavigate, useParams } from "react-router-dom";
import '../Styles/ProjectPad.css'
import PlatformHeader from "./PreMadeComponents/PlatformHeader";





// Component: Project Pad (Main Function)
export default function ProjectPad() {

    const { projectId } = useParams();

    const homePadContext = useContext(HomePadContext);
    
    const project = homePadContext.projects[parseInt(projectId, 10)];


    return ( 
        <div 
            className="project-float-pad flex-col height-full width-full" 
            style={{background: 'white'}}
        >
            {/* Platform Header */}
            <PlatformHeader/>

            {/* project Content Area */}
            <div className='project-content-area flex-row flex-grow overflow-auto min-height-0'>

                {/** cover side */}
                <CoverSide projImgPath={project.projImgPath}/>

                {/** project details section */}
                <div className='project-details-section bg-1 flex-grow flex-col gap-13px padding-34px overflow-auto'>

                    {/* Title Description Section */}
                    <TitleDescriptionSection title={project.title} description={project.description}/>

                    {/** separator */}
                    <div style={{height: '13px'}}/>

                    {/* Details Section */}
                    <DetailsSection  {...project}/>
                    
                    {/** separator */}
                    <div style={{height: '13px'}}/>

                    {/* Developers Section */}
                    <DevelopersSection developers={project.developers}/>

                    {/* Supervisor Section */}
                    <SupervisorSection supervisor={project.supervisor}/>

                    {/* Float Action Buttons */}
                    <div 
                        className='float-action-btns pos-fixed gap-8px flex-row' 
                        style={{bottom: '34px', left: '34px'}}
                    >
                        <CircleButton>
                            <Chat20Regular/>
                        </CircleButton>
                        <CircleButton>
                            <Heart20Regular/>
                        </CircleButton>
                        <ProjectOptionsMenu/>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}




// -----------------------------------------------------------------------------
// Component: CoverSide
function CoverSide({projImgPath}) {
    return <div className='cover-side height-full block padding-13px'>
        <img
            className="bg-2 height-full width-auto block border-radius-8px"
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

    return <div className="gap-13px flex-col">
        <div className="flex-row gap-8px items-center justify-between">
            <h1>{title}</h1>
            <div className="flex-col gap-0px items-center">
                <div className='flex-row justify-between width-full'>
                    <span>تقييم المشروع</span>
                    <span>5/{rate}</span>
                </div>
                <Slider 
                    max={5}  
                    value={rate}
                    style={{width: '100%', padding: '0'}}
                    onChange={(ev)=>setRate(ev.target.value)}
                />
            </div>
        </div>
        <div><p>{description}</p></div>
    </div>;
}



// -----------------------------------------------------------------------------
// Component: DetailsSection
function DetailsSection({keywords, categories, major, collage, semester, academicYear}) {

    return <div className='details-section flex-col gap-13px'>

        <div className="detail-section collage-section flex-row gap-13px">
            <h3 style={{ color: 'rgba(0, 0, 0, 0.8)' }}>الكلية</h3>
            <p>{collage}</p>
        </div>

        <div className="detail-section major-section flex-row gap-13px">
            <h3 style={{ color: 'rgba(0, 0, 0, 0.8)' }}>الفصل الدراسي</h3>
            <p>{semester}</p>
        </div>

        <div className="detail-section major-section flex-row gap-13px">
            <h3 style={{ color: 'rgba(0, 0, 0, 0.8)' }}>التخصص</h3>
            <p>{major}</p>
        </div>

        <div className="detail-section major-section flex-row gap-13px">
            <h3 style={{ color: 'rgba(0, 0, 0, 0.8)' }}>السنة الدراسية</h3>
            <p>{academicYear}</p>
        </div>

        <CategoriesSection categories={categories}/>

        <KeywordsSection keywords={keywords}/>

    </div>
}


// -----------------------------------------------------------------------------
// Component: KeywordsSection
function KeywordsSection({keywords}) {    

    return <div className="detail-section keywords-section flex-row gap-13px">
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

    return <div className="detail-section categories-section flex-row gap-13px">
        <h3 style={{ color: 'rgba(0, 0, 0, 0.8)' }}>الفئات</h3>
        <div className="flex-row gap-3px">{categories.map((category) => {
            return <span className='proj-category-span cursor-pointer'>{category}</span>;
        })}</div>
    </div>;
}



// -----------------------------------------------------------------------------
// Component: DevelopersSection
function DevelopersSection({developers}) {
    return <span className="data-section developers-section flex-col gap-13px">
        <h3>إعداد الطلبة</h3>
        <div className='flex-row flex-wrap gap-8px'>{developers.map((dever, index) => {
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
                <Person20Regular /> {dever}
            </Button>;
        })}</div>
    </span>;
}

// -----------------------------------------------------------------------------
// Component: SupervisorSection
function SupervisorSection({supervisor}) {
    return <span className="data-section developers-section flex-col gap-13px">
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
            <Person20Regular /> {supervisor}
        </Button>
    </span>;
}

// -----------------------------------------------------------------------------
// Component: CircleButton
function CircleButton (props) {

    return <Button appearance="primary" style={{ 
        display: 'flex',
        gap: '8px', borderRadius: '50em', 
        minHeight: '40px', padding: '0',
        minWidth: '40px'
    }} {...props}>
        {props.children?? ''}
    </Button>
}


// -----------------------------------------------------------------------------
// Component: ProjectOptionsMenu
function ProjectOptionsMenu() {
    return (
        <Menu className='project-options-menu'>
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