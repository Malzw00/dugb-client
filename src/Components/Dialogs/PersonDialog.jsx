import Dialog from "@components/Dialogs/AbstractDialog";
import { Divider, Link, tokens } from "@fluentui/react-components";
import { Person48Regular } from "@fluentui/react-icons";
import { getStudentById, getSupervisorById } from "@root/src/services/people";
import { setPerson } from "@root/src/store/slices/person.slice";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "@PreMadeComponents/Loading";

// كائن التخطيط لتحديد الخصائص بناءً على النوع
const PERSON_TYPE_CONFIG = {
    students: {
        fetchFunction: getStudentById,
        idKey: 'student_id',
        nameKey: 'student_name',
        fatherNameKey: 'student_father_name',
        grandNameKey: 'student_grandfather_name',
        familyNameKey: 'student_family_name',
        fullNameKey: 'student_full_name',
        emailKey: 'student_email',
        title: 'الطالب',
        projectsTitle: 'مشروع الطالب',
        personTypeText: 'الطالب'
    },
    supervisors: {
        fetchFunction: getSupervisorById,
        idKey: 'supervisor_id',
        nameKey: 'supervisor_name',
        fatherNameKey: 'supervisor_father_name',
        grandNameKey: 'supervisor_grandfather_name',
        familyNameKey: 'supervisor_family_name',
        fullNameKey: 'supervisor_full_name',
        emailKey: 'supervisor_email',
        title: 'المشرف',
        projectsTitle: 'مشاريع المشرف',
        personTypeText: 'المشرف'
    }
};

export default function PersonDialog({ style }) {
    
    const dispatch = useDispatch();
    const personId = useSelector(state => state.person.value);
    const selectedPeopleTab = useSelector(state => state.selectedPeopleTab.value);
    const [personData, setPersonData] = useState({});
    const [loading, setLoading] = useState(true);

    const config = PERSON_TYPE_CONFIG[selectedPeopleTab];

    useEffect(() => {
        if (!personId) {
            setLoading(false);
            return;
        }

        const loadPersonData = async () => {
            setLoading(true);
            try {
                const response = await config.fetchFunction(personId);
                const data = response?.data?.result || {};
                
                setPersonData({
                    id: data[config.idKey],
                    name: data[config.nameKey],
                    fatherName: data[config.fatherNameKey],
                    grandName: data[config.grandNameKey],
                    familyName: data[config.familyNameKey],
                    fullName: data[config.fullNameKey],
                    email: data[config.emailKey],
                    Department: data.Department,
                    Projects: data.Projects,
                    updatedAt: data.updatedAt,
                    type: selectedPeopleTab
                });
            } catch (error) {
                console.error('Fetch Person Data Error', error);
            } finally {
                setLoading(false);
            }
        };

        loadPersonData();
    }, [personId, selectedPeopleTab, config]);

    const dialogTitle = loading 
        ? 'جاري تحميل البيانات...' 
        : `بيانات ${config.title} ${personData?.name || ''}`;

    return ( 
        <Dialog
            className='person-dialog'
            title={dialogTitle}
            style={style}
            body={
                loading ? 
                <Loading /> : 
                <PersonDialogBody person={personData} config={config} />
            }
            footer={
                !loading && personData?.Projects?.length > 0 ? 
                <Footer person={personData} config={config} /> : 
                null
            }
            onCloseBtnClick={() => dispatch(setPerson(null))}
        />
    );
}

function PersonDialogBody ({ person, config }) {
    return (
        <div className="person-dialog-body">
            <div>
                <div className="profile-image-div">
                    {person?.profile_image_id ? 
                        <img className="profile-image" alt="صورة الملف الشخصي" /> : 
                        <Person48Regular/>
                    }
                </div>
            </div>
            
            <div className='details' style={{flex: '1',}}>
                {person.name && <div className="row">
                    <h3 className="field">إسم {config.personTypeText}</h3>
                    <p className="value">
                        {person.name} <span> </span>
                        {person.fatherName} <span> </span>
                        {person.grandName} <span> </span>
                        {person.familyName} <span> </span>
                    </p>
                </div>}
                
                {person?.email && <div className="row">
                    <h3 className="field">البريد الإلكتروني</h3>
                    <Link href={`mailto:${person.email}`} className="value">{person.email}</Link>
                </div>}
                
                {person?.Department && <div className="row">
                    <h3 className="field">القسم</h3>
                    <p className="value">{person.Department.department_name}</p>
                </div>}

                {person?.Department?.Collage && <div className="row">
                    <h3 className="field">الكلية</h3>
                    <p className="value">{person.Department.Collage.collage_name}</p>
                </div>}
                
                {person?.updatedAt && <div className="row">
                    <h3 className="field">آخر تحديث للبيانات</h3>
                    <p className="value">{new Date(person.updatedAt).toISOString().slice(0,10)}</p>
                </div>}
            </div>
        </div>
    );
}

function Footer ({ person, config }) {
    return (
        <div className="flex-col border-radius-5px bg-3 padding-13px gap-13px">
            <h3 className="field">{config.projectsTitle}</h3>
            <div className="value">
                {person?.Projects?.map((project) => (
                    <div key={project.project_id}>
                        <Link href={`/home/projects/${project.project_id}`}>
                            {project.project_title}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}