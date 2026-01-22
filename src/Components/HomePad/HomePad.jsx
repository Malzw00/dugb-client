import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { matchPath } from "react-router-dom";
import '@styles/HomePad.css';
import ControlPad from '@components/ControlPad/ControlPad';
import Header from './Header';
import ProjectsHomePad from '@components/HomePad/ProjectsHomePad/ProjectsHomePad';
import { useSelector } from 'react-redux';
import CategoriesHomePad from '@components/HomePad/CategoriesHomePad/CategoriesHomePad';
import PeopleHomePad from '@components/HomePad/PeopleHomePad/PeopleHomePad';
import PersonDialog from '@root/src/components/Dialogs/PersonDialog';
import SearchHomePad from './SearchHomePad/SearchHomePad';
import ProfileDialog from '../Dialogs/ProfileDialog';
import ProjectPad from '@components/ProjectPad';
import { useEffect } from 'react';
import SearchProjectContentArea from './SearchHomePad/SearchProjectContentArea';
import SearchStudentContentArea from './SearchHomePad/SearchStudentContentArea';
import SearchSupervisorContentArea from './SearchHomePad/SearchSupervisorContentArea';



export default function HomePad() {
    
    const location = useLocation();

    const person = useSelector(state => state.person.value);
    const profile = useSelector(state => state.profile.value);
    
    const shouldShowHeader = !matchPath(
        { path: "/home/projects/:projectId", end: true },
        location.pathname
    );


    return (
        <div className="home-pad-parent">
            {shouldShowHeader && <Header />}
            
            <Routes>
                {/* <Route path="/" element={
                    selectedHeaderTab === 'projects'? <ProjectsHomePad/> 
                    : selectedHeaderTab === 'categories'? <CategoriesHomePad/>
                    : selectedHeaderTab === 'people'? <PeopleHomePad/>
                    : selectedHeaderTab === 'search'? <SearchHomePad/>
                    : selectedHeaderTab === 'control'? <ControlPad/>
                    : null
                }/> */}
                <Route path="/projects/:projectId" element={<ProjectPad/>}/>
                <Route path="/" element={<NavToProjects/>}/>
                <Route path="/projects" element={<ProjectsHomePad/>}/>
                <Route path="/categories/:categoryId" element={<CategoriesHomePad/>}/>
                <Route path="/categories" element={<CategoriesHomePad/>}/>
                <Route path="/people" element={<PeopleHomePad/>}/>
                <Route path="/search" element={<NavToSearchProjects/>}/>
                <Route path="/search/projects" element={<SearchHomePad 
                    contentarea={<SearchProjectContentArea/>}
                />}/>
                <Route path="/search/students" element={<SearchHomePad
                    contentarea={<SearchStudentContentArea/>}
                />}/>
                <Route path="/search/supervisors" element={<SearchHomePad
                    contentarea={<SearchSupervisorContentArea/>}
                />}/>
                <Route path="/control" element={<ControlPad/>}/>
            </Routes>
            
            {person && <PersonDialog style={{ width:'60%', minHeight:'80%' }}/>}
            {profile && <ProfileDialog style={{ minWidth:'60%' }}/>}
        </div>
    );
}


function NavToProjects () {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/home/projects');
    }, [])
    return <>
    </>
}

function NavToSearchProjects () {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/home/search/projects');
    }, [])
    return <>
    </>
}