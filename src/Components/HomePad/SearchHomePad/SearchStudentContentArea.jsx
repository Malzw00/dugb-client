import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchInput from "@components/PreMadeComponents/searchInput";
import { setSearchText } from "@root/src/store/slices/searchText.slice";
import { Spinner } from "@fluentui/react-components";
import { searchForStudents } from "@root/src/services/people";
import { setSearchedStudents } from "@root/src/store/slices/searchedStudents.slice";
import PersonCard from "@PreMadeComponents/PersonCard";
import { selectPeopleTab } from "@root/src/store/slices/selectedPeopleTab.slice";
import { selectSearchTab } from "@root/src/store/slices/selectedSearchTab.slice";
import { useSearchParams } from "react-router-dom";
import { setPerson } from "@root/src/store/slices/person.slice";



export default function SearchStudentContentArea() {

    const dispatch = useDispatch();
    
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('keyword')

    const searchText = useSelector(state => state.searchText.value);
    const searchedStudents = useSelector(state => state.searchedStudents.value);
    const [loading, setLoading] = useState(false);
    
    const searchAction = function () {
        
        setLoading(true);
        
        searchForStudents({ text: keyword ?? searchText })
        .then(res => {

            const students = res?.data?.result || []

            dispatch(setSearchedStudents(students));
            
            setLoading(false);
        })
        .catch(err => console.log(err))
    }

    useEffect(() => {
        dispatch(setSearchText(keyword?? ''));
        searchAction();
    }, [keyword]);

    useEffect(() => {
        dispatch(selectSearchTab('students'));
    }, []);

    return (
        <div className="content-area">
            
            <SearchInput
                placeholder={'البحث عن طالب'}
                searchText={searchText}
                onChange={(e) => {
                    dispatch(setSearchText(e.target.value));
                }}
                handleClearAction={() => dispatch(setSearchText(''))}
                handleSearchAction={searchAction}
            />

            <div className={`people-area`}>
                <div className={`people-list ${
                    (searchedStudents.length < 1) && 'flex-row justify-center items-center'
                }`}>
                    {loading && <Spinner style={{margin:'13px'}}/>}
                    {searchedStudents.map((student, index) => {
                        const studentName = (
                            student.student_name
                            + ' ' + student.student_father_name
                            + ' ' + student.student_grandfather_name
                            + ' ' + student.student_family_name
                        );
                        return <PersonCard
                            key={index}
                            index={index}
                            name={studentName}
                            updated_at={student.updated_at}
                            onClick={() => {
                                dispatch(selectPeopleTab('students'));
                                dispatch(setPerson(student.student_id));
                            }}
                        />
                    })}
                    
                    {(searchedStudents.length < 1) && <p className="placeholder-label">
                        {(searchText.trim() === '') && 'أكتب شيئاً في مربع البحث'}
                    </p>}
                </div>
            </div>
        </div>
    );
}