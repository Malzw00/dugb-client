
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStudents, getSupervisors } from "@root/src/services/people";
import PersonCard from "@root/src/components/PreMadeComponents/PersonCard";
import { setPerson } from "@root/src/store/slices/person.slice";



export default function PeopleContentArea({}) {

    const dispatch = useDispatch();

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

            <div 
                className="people-area" 
                style={{background:'transparent', border:'none', boxShadow:'none'}}>
                    
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
                            updated_at={person.updatedAt}
                        />
                    })}
                </div>
            </div>
        </div>
    );
}