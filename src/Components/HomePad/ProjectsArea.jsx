import { Tab, TabList } from "@fluentui/react-components";
import ProjectCard from "@components/PreMadeComponents/ProjectCard";
import { useSelector } from "react-redux";


export default function ProjectsArea() {

    const projects = useSelector(state => state.projects.value);

    return <div className='projects-area min-height-0'>
        
        <TabList vertical={false} className="ranks-bar" defaultSelectedValue={1}>
            <Tab className='rank-tab' value={1}>الأحدث</Tab>
            <Tab className='rank-tab' value={2}>الأقدم</Tab>
            <Tab className='rank-tab' value={3}>الأعلى تقييما</Tab>
            <Tab className='rank-tab' value={4}>الأقل تقييما</Tab>
        </TabList>

        <div className="projects-list height-full overflowY-auto min-height-0">
            {projects.map((project, index) => (
                <ProjectCard key={project.id} {...project} projectID={index}/>
            ))}
        </div>
    </div>
}