import SideBar from "./SideBar";
import '../../Styles/ControlPad.css';
import ProjectsCA from "./ProjectsCA";
import AdminsCA from "./AdminsCA";
import AccountsCA from "./AccountsCA";
import { useState } from "react";



export default function ControlPad() {
    
    const [contentArea, setContentArea] = useState('projects'/** [admins, accounts, admins] */);

    return <div className='control-pad height-100 width-100 flex-row'>

        <SideBar setContentArea={setContentArea} contentArea={contentArea}/>
        <ContentArea contentArea={contentArea}/>
    </div>
}


function ContentArea(props) {

    const { contentArea } = props;

    return (
        <>
            {contentArea === 'projects' && <ProjectsCA/>}   
            {contentArea === 'admins' && <AdminsCA/>}   
            {contentArea === 'accounts' && <AccountsCA/>}   
        </>
    );
}