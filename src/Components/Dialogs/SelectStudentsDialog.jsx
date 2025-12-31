import React, { useState, useCallback, useEffect } from "react";
import Dialog from "./AbstractDialog";
import { Button, Input, tokens, Checkbox, Avatar, Badge } from "@fluentui/react-components";
import { useDispatch } from "react-redux";
import { clearControlDialog } from "@root/src/store/slices/controlDialog.slice";
import Loading from "@PreMadeComponents/Loading";
import { Search20Regular } from "@fluentui/react-icons";
import { getStudents } from "@root/src/services/people";
import AddStudentDialog from "./AddStudentDialog";

export default function SelectStudentsDialog({ departmentId, currentStudents = [], onSelect, onCancel }) {
    
    const [isLoading, setIsLoading] = useState(true);
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState(currentStudents);
    const [searchTerm, setSearchTerm] = useState('');
    const [createStudentDialog, setCreateStudentDialog] = useState(null);

    const filteredStudents = students.filter(student =>
        student.student_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // جلب الطلبة حسب القسم
    useEffect(() => {
        fetchStudents();
    }, [departmentId]);
    
    const fetchStudents = async () => {
        setIsLoading(true);
        try {
            const response = await getStudents({ departmentId });
            setStudents(response.data?.result || []);

        } catch (error) {
            console.error('Error fetching students:', error);

        } finally {
            setIsLoading(false);
        } 
    };

    const handleToggleStudent = useCallback((student) => {
        setSelectedStudents(prev => {
            const isSelected = prev.some(s => s.student_id === student.student_id);
            if (isSelected) {
                return prev.filter(s => s.student_id !== student.student_id);
            } else {
                return [...prev, student];
            }
        });
    }, []);

    const handleSelectAll = useCallback(() => {
        if (selectedStudents.length === filteredStudents.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents([...filteredStudents]);
        }
    }, [filteredStudents, selectedStudents.length]);

    const handleSelect = useCallback(() => {
        if (onSelect) {
            onSelect(selectedStudents);
        }
        onCancel();
    }, [selectedStudents, onSelect, onCancel]);

    const openCreateDialog = useCallback(() => {
        setCreateStudentDialog(true);
    });

    const closeCreateDialog = useCallback(() => {
        setCreateStudentDialog(null);
    });

    const handleStudentAdded = useCallback(() => {
        fetchStudents();
        closeCreateDialog()
    });

    return (
        <Dialog
            style={{ width: '60%', minWidth: '600px', maxHeight: '80vh' }}
            title={`تحديد الطلبة`}
            body={
                <SelectStudentsDialogBody 
                    students={filteredStudents}
                    selectedStudents={selectedStudents}
                    onToggleStudent={handleToggleStudent}
                    onSelectAll={handleSelectAll}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    isLoading={isLoading}
                    openCreateDialog={openCreateDialog}
                />
            }
            onCloseBtnClick={onCancel}
            footer={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '14px', fontWeight: '500' }}>
                        تم اختيار {selectedStudents.length} طالب
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Button 
                            appearance="secondary" 
                            onClick={onCancel}
                            disabled={isLoading}
                        >
                            إلغاء
                        </Button>
                        <Button 
                            appearance="primary" 
                            onClick={handleSelect}
                            disabled={isLoading}
                        >
                            تأكيد الاختيار ({selectedStudents.length})
                        </Button>
                    </div>

                    {createStudentDialog && <AddStudentDialog 
                        onStudentAdded={handleStudentAdded}
                        onClose={() => {
                            closeCreateDialog();
                        }}
                    />}
                </div>
            }
        />
    );
}

function SelectStudentsDialogBody({ students, openCreateDialog, selectedStudents, onToggleStudent, searchTerm, setSearchTerm, isLoading }) {
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                اختر الطلبة من القائمة (يمكن اختيار أكثر من طالب)
            </div>

            <Button
                appearance="primary"
                onClick={openCreateDialog}>
                إضافة طالب
            </Button>
            
            {/* شريط البحث */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500' }}>بحث عن طالب</label>
                <Input 
                    placeholder="ابحث بالاسم"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={isLoading}
                    contentBefore={<Search20Regular />}
                />
            </div>
            
            {/* اختيار الكل */}
            {students.length > 0 && !isLoading && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '14px', fontWeight: '500' }}>
                        {students.length} طالب متاح
                    </div>
                </div>
            )}
            
            {/* حالة التحميل */}
            {isLoading ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>
                    <Loading size="medium" />
                    <div style={{ marginTop: '16px' }}>جاري تحميل قائمة الطلبة...</div>
                </div>
            ) : students.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                    {searchTerm ? 'لم يتم العثور على طلبة مطابقين للبحث' : 'لا يوجد طلبة في هذا القسم'}
                </div>
            ) : (
                <div style={{ 
                    display: 'flex',
                    maxHeight: '350px',
                    borderRadius: '6px',
                    flexDirection: 'column',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '10px',
                    padding: '10px'
                }}>
                    {students.map((student) => {
                        const isSelected = selectedStudents.some(s => s.student_id === student.student_id);
                        
                        return (
                            <div 
                                key={student.student_id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '12px',
                                    border: `1px solid ${isSelected ? tokens.colorBrandStroke1 : tokens.colorNeutralStroke2}`,
                                    backgroundColor: isSelected 
                                        ? tokens.colorBrandBackground2 
                                        : tokens.colorNeutralBackground1,
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onClick={() => onToggleStudent(student)}
                            >
                                <Checkbox 
                                    checked={isSelected}
                                    style={{ marginRight: '12px' }}
                                />
                                <Avatar 
                                    size={40} 
                                    name={student.student_name}
                                    style={{ margin: '12px' }}
                                />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '14px' }}>
                                        {student.student_name} <span> </span>
                                        {student.student_father_name} <span> </span>
                                        {student.student_grandfather_name} <span> </span>
                                        {student.student_family_name} <span> </span>
                                    </div>
                                    <div style={{ fontSize: '13px', color: tokens.colorNeutralForeground3 }}>
                                        الإيميل: {student.student_email}
                                    </div>
                                    <div style={{ fontSize: '12px', color: tokens.colorNeutralForeground3, display: 'flex', gap: '12px', marginTop: '4px' }}>
                                        <span>آخر تحديث: {student.updated_at}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            
            
        </div>
    );
}