import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchText } from "@root/src/store/slices/searchText.slice";
import { searchForSupervisors } from "@root/src/services/people";
import { setSearchedSupervisors } from "@root/src/store/slices/searchedSupervisor.slice";
import { Spinner } from "@fluentui/react-components";
import SearchInput from "@components/PreMadeComponents/searchInput";
import PersonCard from "@PreMadeComponents/PersonCard";
import { selectSearchTab } from "@root/src/store/slices/selectedSearchTab.slice";
import { useSearchParams } from "react-router-dom";
import { setPerson } from "@root/src/store/slices/person.slice";
import { selectPeopleTab } from "@root/src/store/slices/selectedPeopleTab.slice";



export default function SearchSupervisorContentArea() {

    const dispatch = useDispatch();
    
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('keyword')

    const searchText = useSelector(state => state.searchText.value);
    const searchedSupervisors = useSelector(state => state.searchedSupervisors.value);
    const [loading, setLoading] = useState(false);
    
    const searchAction = function () {
        
        setLoading(true);
        
        searchForSupervisors({ text: searchText })
        .then(res => {

            const students = res?.data?.result || []

            dispatch(setSearchedSupervisors(students));
            
            setLoading(false);
        })
        .catch(err => console.log(err))
    }

    useEffect(() => {
        dispatch(selectSearchTab('supervisors'));
    }, []);

    useEffect(() => {
        dispatch(setSearchText(keyword?? ''));
        searchAction();
    }, [keyword]);

    return (
        <div className="content-area">
            
            <SearchInput
                placeholder={'البحث عن مشرف'}
                searchText={searchText}
                onChange={(e) => {
                    dispatch(setSearchText(e.target.value));
                }}
                handleClearAction={() => dispatch(setSearchText(''))}
                handleSearchAction={searchAction}
            />

            <div className={`people-area`}>
                <div className={`people-list ${
                    (searchedSupervisors.length < 1) && 'flex-row justify-center items-center'
                }`}>
                    {loading && <Spinner style={{margin:'13px'}}/>}
                    {searchedSupervisors.map((supervisor, index) => {
                        const supervisorName = (
                            supervisor.supervisor_name
                            + ' ' + supervisor.supervisor_father_name
                            + ' ' + supervisor.supervisor_grandfather_name
                            + ' ' + supervisor.supervisor_family_name
                        );
                        return <PersonCard
                            key={index}
                            index={index}
                            name={supervisorName}
                            updated_at={supervisor.updated_at}
                            onClick={() => {
                                dispatch(selectPeopleTab('supervisors'))
                                dispatch(setPerson(supervisor.supervisor_id))
                            }}
                        />
                    })}
                    
                    {(searchedSupervisors.length < 1) && <p className="placeholder-label">
                        {
                            (searchText.trim() === '') && 'أكتب شيئاً في مربع البحث'
                        }
                    </p>}
                </div>
            </div>
        </div>
    );
}