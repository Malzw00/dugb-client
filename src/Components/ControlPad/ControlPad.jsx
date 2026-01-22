import SideBar from "./SideBar";
import '@styles/ControlPad.css';
import { useDispatch, useSelector } from "react-redux";
import Projects from "./Projects";
import Permissions from "./Permissions";
import Accounts from "./Accounts";
import Categories from "./Categories";
import Students from "./Students";
import Supervisors from "./Supervisors";
import References from "./References";
import Files from "./Files";
import Collages from "./Collages";
import Departments from "./Departments";
import { selectHeaderTab } from "@root/src/store/slices/selectedHeaderTab.slice";
import { useEffect } from "react";



export default function ControlPad() {
    
    const dispatch = useDispatch();

    const selectedControlPanel = useSelector(state => state.selectedControlPanel.value);
    
    useEffect(() => {
        dispatch(selectHeaderTab('control'));
    }, []);

    return <div className='flex-row control-pad height-100 width-100'>

        <SideBar />
        <ControlArea selectedControlPanel={selectedControlPanel}/>
    </div>
}


function ControlArea({ selectedControlPanel }) {

    return (
        <>
            {selectedControlPanel === 'projects'    && <Projects/>}   
            {selectedControlPanel === 'categories'  && <Categories/>}   
            {selectedControlPanel === 'students'    && <Students/>}   
            {selectedControlPanel === 'supervisors' && <Supervisors/>}   
            {selectedControlPanel === 'references'  && <References/>}   
            {selectedControlPanel === 'files'       && <Files/>}   
            {selectedControlPanel === 'permissions' && <Permissions/>}   
            {selectedControlPanel === 'collages'    && <Collages/>}   
            {selectedControlPanel === 'departments' && <Departments/>}   
            {selectedControlPanel === 'accounts'    && <Accounts/>}   
        </>
    );
}