import { createContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import '@styles/HomePad.css';
import SideBar from '@components/HomePad/SideBar';
import ContentArea from '@components/HomePad/ContentArea';
import ProjectPad from '@components/ProjectPad';
import ProfilePad from '@components/ProfilePad';
import DocumentationPad from '@components/DocumentationPad/DocumentationPad';
import ControlPad from '@components/ControlPad/ControlPad';



export const HomePadContext = createContext();

export default function HomePad() {

    const navigate = useNavigate();

    const openProject = (projectId) => navigate(`/home/project/${projectId}`);

    return (
        <Routes>
            {/** home pad route */}
            <Route path="/" element={
                <div id="home-pad">
                    <SideBar />
                    <ContentArea />
                </div>
            }/>

            {/** project pad route */}
            <Route path="/project/:projectId" element={<ProjectPad/>}/>

            {/** profile pad route */}
            <Route path="/profile/:userId" element={<ProfilePad/>}/>

            {/** Control pad route */}
            <Route path="/control" element={<ControlPad/>}/>

            {/** project documentation pad route */}
            <Route path="/control/documentation" element={<DocumentationPad/>}/>
        </Routes>
    );
}