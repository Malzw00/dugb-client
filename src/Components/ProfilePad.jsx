import { useContext } from "react";
import { useParams } from "react-router-dom";
import PlatformHeader from "./PreMadeComponents/PlatformHeader";
import { 
    Avatar, Button, Menu, MenuButton, MenuItem, MenuList, 
    MenuTrigger, Tab, TabList, MenuPopover
} from "@fluentui/react-components";
import {  
    Edit16Regular, 
    List20Regular, 
    Person48Regular, 
    SignOut20Regular 
} from "@fluentui/react-icons";
import ProjectCard from "./PreMadeComponents/ProjectCard";
import '@styles/ProfilePad.css';



// Profile Pad (Main Function)
export default function ProfilePad() {

    const homePadContext = useContext(HomePadContext);
    const {userId} = useParams();
    const globalContext = useContext(GlobalContext);

    let user = userId === 'user'? globalContext.globalState.user : null;

    return (
        <div className='flex-col profile-pad height-full width-full'>

            {/* Header */}
            <PlatformHeader/>

            {/* Profile Area */}
            <div className="flex-row justify-center flex-grow overflow-auto profile-area width-full bg-1 bg-2">
                
                {/* Profile Content */}
                <div className="flex-col profile-content height-full" style={{width: '70%'}}>
                    
                    {/* Profile Details */}
                    <ProfileDetails user={user} />
                    
                    {/* Interaction Log */}
                    <InteractionLog projects={homePadContext.projects} />
                </div>
            </div>

        </div>
    );
}



// -----------------------------------------------------------------------------
// Component: ProfileDetails
function ProfileDetails({ user }) {
    return (
        <div className="flex-col items-stretch profile-details gap-5px bg-1">
            <div className="flex-row padding-34px gap-34px">

                {/* profile avatar */}
                <div className="profile-avatar pos-relative editable-field">
                    <Avatar 
                        className="editable-field"
                        name={user?.name} 
                        icon={<Person48Regular/>} 
                        style={{width: '144px', height: '144px'}}
                    />
                    <EditBtn unvisible appearance='primary' className="pos-absolute left-8px bottom-8px"/>
                </div>

                {/* profile data */}
                <ProfileData user={user}/>

                {/* profile options menu */}
                <ProfileMenu/>
            </div>

            {/* Interaction Tabs */}
            <InteractionTabs/>
        </div>
    );
}



// -----------------------------------------------------------------------------
// Component: ProfileData
function ProfileData({ user }) {
    return (
        <div className="flex-col flex-grow profile-data gap-5px">
            <h2 className="flex-row text-center editable-field pos-relative gap-8px width-fit-c">
                <div>{user?.name}</div>
                <div 
                    style={{
                        color: 'gray', 
                        direction: 'ltr', 
                        fontWeight: 'normal', 
                        fontSize: '15px'
                    }}
                >
                    @{user?.username}
                </div>
                <EditBtn className="" unvisible/>
            </h2>
            
            <p className="editable-field pos-relative width-fit-c" style={{fontSize: '16px'}}>
                {user?.bio} <EditBtn className="pos-absolute" unvisible/>
            </p>
            
            <p 
                className="editable-field pos-relative width-fit-c" 
                style={{fontSize: '12px', color: 'gray'}}
            >
                {user?.bdate} <EditBtn className="pos-absolute" unvisible/>
            </p>
        </div>
    );
}



// -----------------------------------------------------------------------------
// Component: Interaction Tabs
function InteractionTabs() {
    return (
        <TabList className="projects-tab paddingX-34px" defaultSelectedValue={0}>
            <Tab key={0} value={0}> الكل </Tab>
            <Tab key={1} value={1}> الإعجابات </Tab>
            <Tab key={2} value={2}> التعليقات </Tab>
            <Tab key={3} value={3}> التقييمات </Tab>
        </TabList>
    );
}



// -----------------------------------------------------------------------------
// Component: InteractionLog
function InteractionLog({ projects }) {
    return (
        <div className="flex-col interaction-log">

            {/* projects list */}
            <div className="flex-col projects-list gap-8px paddingY-13px">
                {
                    projects.map((value, index) => (
                        <div key={index} className="project-card-container bg-1">
                            <ProjectCard style={{border:'none'}} {...value} projectID={index}/>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}



// -----------------------------------------------------------------------------
// Component: EditBtn
function EditBtn (props) {
    return (
        <Button
            style={{
                transition: '300ms',
                cursor: 'pointer',
                borderRadius: '50em',
                width: '30px', 
                height: '30px',
                minWidth: '0', 
                opacity: props.unvisible ? '0' : '1'
            }}
            icon={<Edit16Regular/>}
            appearance="transparent"
            {...props}
            className={`edit-btn ${props.className ?? ''}`}
        />
    );
}



// -----------------------------------------------------------------------------
// Component: ProfileMenu
function ProfileMenu() {
    return (
        <Menu className='profile-menu'>
            <MenuTrigger disableButtonEnhancement>
                <MenuButton 
                    className='profile-menu-btn' 
                    style={{alignSelf: 'self-start'}} 
                    appearance="transparent" 
                    icon={<List20Regular/>}
                />
            </MenuTrigger>
            <MenuPopover>
                <MenuList>
                    <MenuItem 
                        style={{ color: 'red' }} 
                        icon={<SignOut20Regular/>}
                        onClick={() => {
                            // TODO: handle logout
                        }}
                    >
                        تسجيل الخروج
                    </MenuItem>
                </MenuList>
            </MenuPopover>
        </Menu>
    );
}
