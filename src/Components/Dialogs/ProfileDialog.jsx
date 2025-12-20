import Dialog from "@components/Dialogs/AbstractDialog";
import { Link } from "@fluentui/react-components";
import { Person48Regular } from "@fluentui/react-icons";
import { getStudentById, getSupervisorById } from "@root/src/services/people";
import { setPerson } from "@root/src/store/slices/person.slice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function PersonDialog() {

    const dispatch = useDispatch();

    const person = useSelector(state => state.person.value);
    const [personData, setPersonData] = useState({});

    React.useEffect(() => {
        
        const thenFunc = res => {
            const _person = res?.data?.result || {};
            setPersonData({
                id: _person[(selectedPeopleTab === 'students')? 'student_id': 'supervisor_id'],
                name: _person[(selectedPeopleTab === 'students')? 'student_name': 'supervisor_name'],
                fullName: _person[(selectedPeopleTab === 'students')? 'student_full_name': 'supervisor_full_name'],
                email: _person[(selectedPeopleTab === 'students')? 'student_email': 'supervisor_email'],
                Department: _person.Department,
                Projects: _person.Projects,
                updatedAt: _person.updatedAt
            });
        };

        const catchFunc = err => console.log(err);

        if(selectedPeopleTab === 'students')
        getStudentById(person).then(thenFunc).catch(catchFunc);
        
        if(selectedPeopleTab === 'supervisors')
        getSupervisorById(person).then(thenFunc).catch(catchFunc);

    }, [person]);
    
    return ( 
        <Dialog
            className='person-dialog'
            title={`بيانات ${selectedPeopleTab === 'students'? 'الطالب':'المشرف'} ${personData?.name || ''}`}
            body={<StudentDialogBody 
                person={personData}
            />}
            footer={<Footer person={personData}/>}
            onCloseBtnClick={() => dispatch(setPerson(null))}
        />
    );
}



function StudentDialogBody ({ person }) {
    
    return (
        <div className="rows-div person-dialog-body">

            <div className="profile-image-div">
                {person?.profile_image_id && <img className="profile-image"/>
                || <Person48Regular/>}
            </div>
            
            <div className='details'>
                {person?.fullName && <div className="row">
                    <h3 className="field">إسم الطالب </h3>
                    <p className="value">{person.fullName}</p>
                </div>}
                
                {person?.email && <div className="row">
                    <h3 className="field">البريد الإلكتروني </h3>
                    <p className="value">{person.email}</p>
                </div>}
                
                {person?.Department && <div className="row">
                    <h3 className="field">القسم </h3>
                    <p className="value">{person.Department.department_name}</p>
                </div>}

                {person?.Department?.Collage && <div className="row">
                    <h3 className="field">الكلية </h3>
                    <p className="value">{person.Department.Collage.collage_name}</p>
                </div>}
                {person?.updatedAt && <div className="row">
                    <h3 className="field">آخر تحديث للبيانات </h3>
                    <p className="value">{new Date(person.updatedAt).toISOString().slice(0,10)}</p>
                </div>}
            </div>
            
        </div>
    )
}



function Footer ({ person }) {

    const selectedPeopleTab = useSelector(state => state.selectedPeopleTab.value);
    
    return <div className="flex-col border-radius-5px bg-3 padding-13px gap-13px">
        <h3 className="field"> 
            {`${selectedPeopleTab === 'students'? 'مشروع الطالب':'مشاريع المشرف'}`} 
        </h3>
        <div className="value">
            {person?.Projects?.map((project, index) => {
                return <div key={index}>
                    <Link href={`/home/projects/${project.project_id}`}>
                        {project.project_title}
                    </Link>
                </div>
            })}
        </div>
    </div>
}