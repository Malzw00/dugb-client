import { Dismiss16Regular, People32Regular, Person20Regular, Add16Regular } from "@fluentui/react-icons";
import Body from "./Body";
import { addProjectStudent, getProjectStudents, removeProjectStudent, setProjectSupervisor } from "@root/src/services/project/people";
import { useEffect, useState, useCallback } from "react";
import { getStudents, getSupervisors } from "@root/src/services/people";
import { Button, Dropdown, Option, Spinner, Text, Badge } from "@fluentui/react-components";

export default function ProjectTeamBody({ currentProject, departments, selectedCollage }) {
    return (
        <Body
            style={{flex:'1'}}
            icon={<People32Regular />}
            title={'فريق العمل'}
            content={
                <Content 
                    currentProject={currentProject}
                    departments={departments}
                    selectedCollage={selectedCollage}
                />
            }
        />
    );
}

function Content({ currentProject, departments }) {

    const [selectedSupervisor, selectSupervisor] = useState(currentProject.supervisor_id);
    const [supervisors, setSupervisors] = useState(null);
    const [selectedDepartment, selectDepartment] = useState(currentProject.department_id);
    const [students, setStudents] = useState([]);
    const [showStudents, setShowStudents] = useState(false);
    const [projectStudents, setProjectStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addingStudent, setAddingStudent] = useState(null);
    const [removingStudent, setRemovingStudent] = useState(null);

    // الحصول على اسم القسم المحدد
    const selectedDepartmentName = departments?.find(
        dept => dept.department_id === selectedDepartment
    )?.department_name || '';

    // الحصول على اسم المشرف المحدد
    const selectedSupervisorName = supervisors?.find(
        supervisor => supervisor.supervisor_id === selectedSupervisor
    ) ? `${supervisors?.find(
        supervisor => supervisor.supervisor_id === selectedSupervisor
    )?.supervisor_name} ${supervisors?.find(
        supervisor => supervisor.supervisor_id === selectedSupervisor
    )?.supervisor_father_name} ${supervisors?.find(
        supervisor => supervisor.supervisor_id === selectedSupervisor
    )?.supervisor_grandfather_name} ${supervisors?.find(
        supervisor => supervisor.supervisor_id === selectedSupervisor
    )?.supervisor_family_name}` : '';

    const fetchProjectStudents = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getProjectStudents(currentProject.project_id);
            const students = res.data?.result || [];
            setProjectStudents(students);
        } catch (err) {
            console.error('fetch project students failed:', err);
            alert('فشل جلب طلبة المشروع');
        } finally {
            setLoading(false);
        }
    }, [currentProject.project_id]);

    const fetchStudents = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getStudents({ departmentId: selectedDepartment });
            const allStudents = res.data?.result || [];
            
            // إزالة طلبة المشروع من قائمة الطلبة المتاحة
            const projectStudentIds = new Set(projectStudents.map(s => s.student_id));
            const availableStudents = allStudents.filter(
                student => !projectStudentIds.has(student.student_id)
            );
            
            setStudents(availableStudents);
        } catch (err) {
            console.error('fetch students failed:', err);
            alert('فشل جلب الطلبة');
        } finally {
            setLoading(false);
        }
    }, [selectedDepartment, projectStudents]);

    const fetchSupervisors = function () {
        getSupervisors()
            .then((res) => {
                setSupervisors(res.data?.result || [])
            })
            .catch(err => {
                console.log(err);
            })
    }

    const handleAddStudent = async (student) => {
        setAddingStudent(student.student_id);
        try {
            await addProjectStudent({ 
                projectId: currentProject.project_id, 
                studentId: student.student_id 
            });
            
            // تحديث القائمة فوراً
            setProjectStudents(prev => [...prev, student]);
            
            // إزالة الطالب من قائمة الطلبة المتاحة
            setStudents(prev => prev.filter(s => s.student_id !== student.student_id));
            
        } catch (err) {
            console.error('add student failed:', err);
            alert('فشل إضافة الطالب');
        } finally {
            setAddingStudent(null);
        }
    };

    const handleDeleteStudent = async (studentId) => {
        setRemovingStudent(studentId);
        try {
            await removeProjectStudent({ 
                projectId: currentProject.project_id, 
                studentId 
            });
            
            // تحديث القائمة فوراً
            const removedStudent = projectStudents.find(s => s.student_id === studentId);
            setProjectStudents(prev => prev.filter(s => s.student_id !== studentId));
            
            // إرجاع الطالب إلى القائمة المتاحة
            if (removedStudent) {
                setStudents(prev => [...prev, removedStudent]);
            }
            
        } catch (err) {
            console.error('remove student failed:', err);
            alert('فشل إزالة الطالب');
        } finally {
            setRemovingStudent(null);
        }
    };

    useEffect(() => {
        fetchProjectStudents();
        fetchSupervisors();
    }, [fetchProjectStudents]);

    useEffect(() => {
        if (showStudents && selectedDepartment) {
            fetchStudents();
        }
    }, [showStudents, selectedDepartment, fetchStudents]);

    const handleDepartmentSelect = (_, data) => {
        selectDepartment(data.selectedOptions[0]);
        setShowStudents(false); // إخفاء قائمة الطلبة عند تغيير القسم
    };

    const handleSupervisorSelect = (_, data) => {
        const sid = data.selectedOptions[0];
        selectSupervisor(sid);
        setProjectSupervisor({ supervisorId: sid, projectId: currentProject.project_id })
    };

    const getFullName = (person) => {
        return `${person.student_name || person.supervisor_name} 
                ${person.student_father_name || person.supervisor_father_name} 
                ${person.student_grandfather_name || person.supervisor_grandfather_name} 
                ${person.student_family_name || person.supervisor_family_name}`;
    };

    return (
        <div style={{ 
            flex: '1', 
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            padding: '0 55px',
            paddingBottom: '21px',
        }}>

            {/* اختيار القسم */}
            <div>
                <Text size={400} weight="semibold" style={{ marginBottom: '8px', display: 'block' }}>
                    القسم
                </Text>
                <Dropdown
                    value={selectedDepartmentName}
                    selectedOptions={[selectedDepartment]}
                    onOptionSelect={handleDepartmentSelect}
                    style={{ width: '100%' }}
                >
                    {departments?.map((department, index) => (
                        <Option key={index} value={department.department_id}>
                            {department.department_name}
                        </Option>
                    ))}
                </Dropdown>
            </div>

            {/* اختيار المشرف */}
            <div>
                <Text size={400} weight="semibold" style={{ marginBottom: '8px', display: 'block' }}>
                    المشرف
                </Text>
                <Dropdown
                    value={selectedSupervisorName}
                    selectedOptions={[selectedSupervisor]}
                    onOptionSelect={handleSupervisorSelect}
                    style={{ width: '100%' }}
                    disabled={!supervisors || supervisors.length === 0}
                >
                    {supervisors?.map((supervisor, index) => (
                        <Option key={index} value={supervisor.supervisor_id}>
                            {getFullName(supervisor)}
                        </Option>
                    ))}
                </Dropdown>
            </div>

            {/* طلبة المشروع */}
            <div>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    marginBottom: '12px'
                }}>
                    <Text size={500} weight="semibold">طلبة المشروع</Text>
                    <Badge appearance="filled" shape="rounded">
                        {projectStudents.length}
                    </Badge>
                </div>
                
                {loading ? (
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        padding: '40px'
                    }}>
                        <Spinner label="جاري التحميل..." />
                    </div>
                ) : projectStudents.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '32px',
                        backgroundColor: '#faf9f8',
                        borderRadius: '8px',
                        border: '1px dashed #e1dfdd'
                    }}>
                        <People32Regular style={{ color: '#8a8886', marginBottom: '12px' }} />
                        <Text>لا يوجد طلبة مضافين إلى المشروع</Text>
                    </div>
                ) : (
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        gap: '8px',
                        backgroundColor: '#faf9f8',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #e1dfdd'
                    }}>
                        {projectStudents.map((student, index) => (
                            <StudentRow 
                                key={student.student_id} 
                                student={student}
                                onDelete={() => handleDeleteStudent(student.student_id)}
                                disabled={removingStudent === student.student_id}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* إضافة طلبة جدد */}
            {showStudents && (
                <div style={{
                    backgroundColor: '#faf9f8',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #e1dfdd'
                }}>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        marginBottom: '16px'
                    }}>
                        <Text size={500} weight="semibold">اختيار طلبة</Text>
                        <Badge appearance="filled" shape="rounded">
                            {students.length}
                        </Badge>
                    </div>
                    
                    {loading ? (
                        <Spinner label="جاري جلب الطلبة..." />
                    ) : students.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '24px',
                            backgroundColor: '#f3f2f1',
                            borderRadius: '8px'
                        }}>
                            <Text>لا يوجد طلبة متاحين للإضافة</Text>
                        </div>
                    ) : (
                        <div style={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: '8px'
                        }}>
                            {students.map((student) => (
                                <Button
                                    key={student.student_id}
                                    icon={<Add16Regular />}
                                    onClick={() => handleAddStudent(student)}
                                    appearance="outline"
                                    disabled={addingStudent === student.student_id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '8px 12px',
                                        borderRadius: '6px'
                                    }}
                                >
                                    {addingStudent === student.student_id ? (
                                        <Spinner size="tiny" />
                                    ) : (
                                        <>
                                            <Person20Regular />
                                            <span>
                                                {student.student_name} {student.student_father_name} {student.student_grandfather_name} {student.student_family_name}
                                            </span>
                                        </>
                                    )}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* زر إضافة طلبة */}
            <Button
                onClick={() => setShowStudents(!showStudents)}
                appearance="primary"
                style={{
                    alignSelf: 'flex-start',
                    marginTop: '8px'
                }}
                icon={showStudents ? <Dismiss16Regular /> : <Add16Regular />}
            >
                {showStudents ? 'إخفاء الطلبة' : 'إضافة طلبة'}
            </Button>
        </div>
    );
}

function StudentRow({ student, onDelete, disabled }) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px 12px',
            backgroundColor: 'white',
            borderRadius: '6px',
            border: '1px solid #e1dfdd',
            transition: 'all 0.2s',
            ':hover': {
                backgroundColor: '#f3f2f1'
            }
        }}>
            <Person20Regular style={{ color: '#0078d4' }} />
            <div style={{ 
                flex: '1', 
                marginRight: '12px',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Text size={300} weight="semibold">
                    {student.student_name} {student.student_father_name} {student.student_grandfather_name} {student.student_family_name}
                </Text>
            </div>
            <Button
                icon={<Dismiss16Regular />}
                onClick={onDelete}
                appearance="subtle"
                disabled={disabled}
                style={{ minWidth: '32px' }}
            />
        </div>
    );
}