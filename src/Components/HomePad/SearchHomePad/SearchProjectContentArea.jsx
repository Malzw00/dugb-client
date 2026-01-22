
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchInput from "@components/PreMadeComponents/searchInput";
import { setSearchText } from "@root/src/store/slices/searchText.slice";
import ProjectCard from "@PreMadeComponents/ProjectCard";
import { searchProjects } from "@root/src/services/project/project";
import { setSearchedProjects } from "@root/src/store/slices/searchedProjects.slice";
import { Spinner } from "@fluentui/react-components";
import { selectSearchTab } from "@root/src/store/slices/selectedSearchTab.slice";
import { useSearchParams } from "react-router-dom";



export default function SearchProjectContentArea() {

    const dispatch = useDispatch();
    
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('keyword')

    const searchText = useSelector(state => state.searchText.value);
    const searchedProjects = useSelector(state => state.searchedProjects.value);
    const [loading, setLoading] = useState(false);
    
    const searchAction = function () {
        
        setLoading(true);
        
        searchProjects({ text: keyword ?? searchText })
        .then(res => {

            const projects = res?.data?.result || []

            dispatch(setSearchedProjects(projects));
            
            setLoading(false);
        })
        .catch(err => console.log(err))
    }

    useEffect(() => {
        dispatch(selectSearchTab('projects'));
    }, []);

    useEffect(() => {
        dispatch(setSearchText(keyword?? ''));
        searchAction();
    }, [keyword]);

    return (
        <div className="content-area">
            
            <SearchInput
                placeholder={'البحث عن مشروع'}
                searchText={searchText}
                onChange={(e) => {
                    dispatch(setSearchText(e.target.value));
                }}
                handleClearAction={() => dispatch(setSearchText(''))}
                handleSearchAction={searchAction}
            />

            <div className={`projects-area`}>
                <div className={`projects-list ${
                    (searchedProjects.length < 1) && 'flex-row justify-center items-center'
                }`}>
                    {loading && <Spinner style={{margin:'13px'}}/>}
                    {searchedProjects.map((project, index) => {
                        return <ProjectCard
                            key={index}
                            iconWidth={30}
                            titleStyle="paragraph"
                            {...project}
                            project_placeholder={
                                'آخر تحديث: ' + 
                                new Date(project.updated_at).toISOString().slice(0, 10)
                            }
                        />
                    })}
                    
                    {(searchedProjects.length < 1) && <p className="placeholder-label">
                        {(searchText.trim() === '') && 'أكتب شيئاً في مربع البحث'}
                    </p>}
                </div>
            </div>
        </div>
    );
}