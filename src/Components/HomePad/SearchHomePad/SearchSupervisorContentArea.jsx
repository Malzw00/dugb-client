
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStudents, getSupervisors } from "@root/src/services/people";
import PersonCard from "@components/PreMadeComponents/PeopleCard";
import { Button, Input } from "@fluentui/react-components";
import { Dismiss16Regular, Search20Regular } from "@fluentui/react-icons";
import { setPerson } from "@root/src/store/slices/person.slice";



export default function SearchSupervisorContentArea({}) {

    const dispatch = useDispatch();

    const [searchText, setSearchText] = useState('');
    const [people, setPeople] = useState([]);
    const selectedPeopleTab = useSelector(state => state.selectedPeopleTab.value);

    React.useEffect(() => {
        
        const thenFunc = res => setPeople(res?.data?.result || []);
        const catchFunc = err => console.log(err);

        if(selectedPeopleTab === 'students')
        getStudents().then(thenFunc).catch(catchFunc);
    
        if(selectedPeopleTab === 'supervisors')
        getSupervisors().then(thenFunc).catch(catchFunc);

    }, [selectedPeopleTab,])

    return (
        <div className="content-area">
            
            <div className="filter-div" style={{width: '60%', padding: '2px', height: 'fit-content'}}>
                <Input 
                    className="search-input" 
                    contentBefore={<Search20Regular/>}
                    placeholder={`بحث عن ${selectedPeopleTab === 'students'? 'طالب': 'مشرف'}`}
                    value={searchText}
                    style={{ flex: '1' }}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <Button icon={<Dismiss16Regular/>} onClick={() => setSearchText('')}/>
            </div>

            <div className="people-area">
                <div className="people-list">
                    {people.map((person, index) => {
                        return <PersonCard 
                            key={index} 
                            type={selectedPeopleTab} 
                            onClick={
                                selectedPeopleTab === 'students'
                                ? () => dispatch(setPerson(person.student_id)) 
                                : () => dispatch(setPerson(person.supervisor_id)) 
                            }
                            id={
                                selectedPeopleTab === 'students'? person.student_id
                                : selectedPeopleTab === 'supervisors'? person.supervisor_id
                                : ''
                            } 
                            name={
                                selectedPeopleTab === 'students'? person.student_full_name
                                : selectedPeopleTab === 'supervisors'? person.supervisor_full_name
                                : ''
                            }
                        />
                    })}
                </div>
            </div>
        </div>
    );
}