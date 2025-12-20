import { Routes, Route, useLocation } from 'react-router-dom';
import '@styles/HomePad.css';
import ProjectPad from '@components/ProjectPad';
import ProfilePad from '@components/ProfilePad';
import DocumentationPad from '@components/DocumentationPad/DocumentationPad';
import ControlPad from '@components/ControlPad/ControlPad';
import Header from './Header';
import ProjectsHomePad from '@components/HomePad/ProjectsHomePad/ProjectsHomePad';
import { useSelector } from 'react-redux';
import CategoriesHomePad from '@components/HomePad/CategoriesHomePad/CategoriesHomePad';
import PeopleHomePad from '@components/HomePad/PeopleHomePad/PeopleHomePad';
import PersonDialog from '@root/src/components/Dialogs/PersonDialog';
import SearchHomePad from './SearchHomePad/SearchHomePad';



export default function HomePad() {
    
    const location = useLocation();
    
    const selectedHeaderTab = useSelector(state => state.selectedHeaderTab.value);
    const person = useSelector(state => state.person.value);
    
    const shouldShowHeader = !location.pathname.includes('/projects/');

    return (
        <div className="home-pad-parent">
            {shouldShowHeader && <Header />}
            
            <Routes>
                <Route path="/" element={
                    selectedHeaderTab === 'projects'? <ProjectsHomePad/> 
                    : selectedHeaderTab === 'categories'? <CategoriesHomePad/>
                    : selectedHeaderTab === 'people'? <PeopleHomePad/>
                    : selectedHeaderTab === 'search'? <SearchHomePad/>
                    : null
                }/>
                <Route path="/projects/:projectId" element={<ProjectPad/>}/>
                <Route path="/profile" element={<ProfilePad/>}/>
                <Route path="/control" element={<ControlPad/>}/>
                <Route path="/control/documentation" element={<DocumentationPad/>}/>
            </Routes>
            
            {person && <PersonDialog/>}
        </div>
    );
}