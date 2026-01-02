import React, { useState, useCallback, useEffect } from "react";
import ControlArea, { Row } from "./ControlArea";
import { Button, Link, Spinner, Input } from "@fluentui/react-components";
import { ArrowClockwise20Regular, Dismiss16Regular, Search16Regular } from "@fluentui/react-icons";
import { setControlDialog } from "@root/src/store/slices/controlDialog.slice";
import Loading from "@PreMadeComponents/Loading";
import { getStudents, deleteStudent, searchForStudents } from "@root/src/services/people";
import { useDispatch, useSelector } from "react-redux";
import AddStudentDialog from "@components/Dialogs/AddStudentDialog";
import EditStudentDialog from "@components/Dialogs/EditStudentDialog";

export default function Students() {
    const dispatch = useDispatch();
    
    const controlDialog = useSelector(state => state.controlDialog.value);
    const [students, setStudents] = useState([]);
    const [loadingStates, setLoadingStates] = useState({});
    const [isLoadingAll, setIsLoadingAll] = useState(false);
    const [editStudent, setEditStudent] = useState({});
    
    // البحث
    const [searchInputText, setSearchInputText] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    // جلب جميع الطلاب
    const fetchAllStudents = useCallback(() => {
        setIsLoadingAll(true);
        
        getStudents({})
            .then(res => {
                setStudents(res.data?.result || []);
            })
            .catch(err => {
                console.error('Error fetching students:', err);
                alert('فشل تحميل الطلاب. يرجى المحاولة مرة أخرى');
            })
            .finally(() => {
                setIsLoadingAll(false);
            });
    }, []);

    const fetchStudentsBySearch = useCallback((searchText) => {
        setIsLoadingAll(true);
        setIsSearching(true);
        
        searchForStudents({ text: searchText })
            .then(res => {
                console.log(res.data.result)
                setStudents(res.data?.result || []);
            })
            .catch(err => {
                console.error('Error searching students:', err);
                alert('فشل في البحث عن الطلاب. يرجى المحاولة مرة أخرى');
            })
            .finally(() => {
                setIsLoadingAll(false);
                setIsSearching(false);
            });
    }, []);

    // جلب البيانات الأولية
    useEffect(() => {
        fetchAllStudents();
    }, []);

    const handleAddDialog = useCallback(() => {
        dispatch(setControlDialog('addStudent'));
    }, []);

    const handleEdit = useCallback((student) => {
        return () => {
            setEditStudent(student);
            dispatch(setControlDialog('editStudent'));
        };
    }, []);

    const handleDelete = useCallback((student) => {
        return async () => {
            if (!window.confirm(`هل أنت متأكد من حذف "${student.student_full_name}"؟`)) {
                return;
            }

            setLoadingStates(prev => ({
                ...prev,
                [student.student_id]: true
            }));

            try {
                const res = await deleteStudent(student.student_id);
                if (res.data?.success) {
                    alert(`تم حذف "${student.student_full_name}"`);
                    const updatedStudents = students.filter(s => s.student_id !== student.student_id);
                    setStudents(updatedStudents);
                }
            } catch (err) {
                console.error('Error deleting student:', err);
                alert('فشل الحذف. يرجى المحاولة مرة أخرى');
            } finally {
                setLoadingStates(prev => {
                    const newState = { ...prev };
                    delete newState[student.student_id];
                    return newState;
                });
            }
        };
    }, [students]);

    const handleRefresh = useCallback(() => {
        if (searchInputText.trim()) {
            fetchStudentsBySearch(searchInputText.trim());
        } else {
            fetchAllStudents();
        }
    }, [searchInputText, fetchStudentsBySearch, fetchAllStudents]);

    const handleSearch = useCallback(() => {
        if (!searchInputText.trim()) {
            fetchAllStudents();
            return;
        }
        
        fetchStudentsBySearch(searchInputText.trim());
    }, [searchInputText, fetchStudentsBySearch, fetchAllStudents]);

    const handleSearchInputChange = useCallback((e) => {
        setSearchInputText(e.target.value);
    }, []);

    const handleSearchKeyPress = useCallback((e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }, [handleSearch]);

    const clearSearch = useCallback(() => {
        setSearchInputText("");
        fetchAllStudents();
    }, [fetchAllStudents]);

    const renderDataContainer = useCallback(() => {
        if (isLoadingAll && students.length === 0) {
            return (
                <Loading size="extra-large" full vertical text='جار تحميل الطلاب...'/>
            );
        }

        if (students.length === 0 && !isLoadingAll) {
            return (
                <div className="flex-row items-center justify-center placeholder-label padding-21px">
                    {searchInputText ? 
                        `لا توجد نتائج للبحث "${searchInputText}"` : 
                        'لا توجد طلاب لعرضها'
                    }
                </div>
            );
        }

        return students.map((student, index) => {
            const isDeleting = loadingStates[student.student_id];
            
            return (
                <Row
                    key={student.student_id}
                    index={index + 1}
                    name={<div style={{ display:'flex', gap:'13px', flexWrap: 'wrap' }}>
                        <span>
                            {student.student_name} <span> </span> 
                            {student.student_father_name} <span> </span>
                            {student.student_grandfather_name} <span> </span>
                            {student.student_family_name}
                        </span>
                        
                        {student.student_email && (
                            <Link href={`mailto:${student.student_email}`}>
                                {student.student_email}
                            </Link>
                        )}
                        
                        {student.department_name && (
                            <div style={{ color: '#666' }}>
                                قسم {student.department_name}
                                {student.collage_name && ` - كلية ${student.collage_name}`}
                            </div>
                        )}
                    </div>}
                    active
                    actions={[
                        {
                            className: 'edit',
                            content: 'تعديل',
                            onClick: handleEdit(student),
                            disabled: isDeleting
                        },
                        {
                            className: 'delete',
                            content: isDeleting ? (
                                <>
                                    <Spinner size="tiny" style={{ marginLeft: '4px' }} />
                                    جاري الحذف...
                                </>
                            ) : 'حذف',
                            onClick: handleDelete(student),
                            disabled: isDeleting
                        },
                    ]}
                />
            );
        });
    }, [students, isLoadingAll, loadingStates, handleEdit, handleDelete]);

    return (
        <ControlArea
            title={'الطلاب'}
            toolbar={[
                (<div key="search-area" style={{ 
                    display: 'flex', 
                    gap: '13px', 
                    alignItems: 'flex-start', 
                    flexWrap: 'wrap',
                    flexDirection: 'column',
                    width: '100%'
                }}>
                    
                    {/* مربع البحث مع زر البحث */}
                    <div style={{ 
                        display: 'flex', 
                        gap: '5px', 
                        alignItems: 'center',
                        flex: 1,
                        minWidth: '50%'
                    }}>
                        <Input
                            placeholder="ابحث عن طالب"
                            value={searchInputText}
                            onChange={handleSearchInputChange}
                            onKeyUp={handleSearchKeyPress}
                            disabled={isLoadingAll}
                            style={{ flex: 1 }}
                            contentBefore={<Search16Regular/>}
                            contentAfter={searchInputText && (
                                <Button
                                    appearance="transparent"
                                    onClick={clearSearch}
                                    disabled={isLoadingAll}
                                    icon={<Dismiss16Regular/>}
                                />
                            )}
                        />
                        <Button
                            appearance="primary"
                            icon={<Search16Regular />}
                            onClick={handleSearch}
                            disabled={isLoadingAll || isSearching}
                            style={{ minWidth: '80px' }}
                        />
                    </div>

                    {/* أزرار الإضافة والتحديث */}
                    <div key="action-buttons" style={{ 
                        display: 'flex', 
                        gap: '5px',
                        alignItems: 'center'
                    }}>
                        <Button
                            appearance='primary' 
                            onClick={handleAddDialog}
                            disabled={isLoadingAll}
                        >
                            إضافة طالب
                        </Button>
                        <Button 
                            appearance='secondary' 
                            onClick={handleRefresh}
                            disabled={isLoadingAll}
                            icon={isLoadingAll ? <Loading paddingless size='extra-tiny' /> : <ArrowClockwise20Regular/>}
                        >
                            تحديث
                        </Button>
                    </div>
                </div>),
            ]}
            dataContainer={renderDataContainer()}
            footer={<>
                {controlDialog === 'addStudent' && <AddStudentDialog 
                    onStudentAdded={() => {
                        handleRefresh();
                        clearSearch();
                    }}
                />}
                {controlDialog === 'editStudent' && <EditStudentDialog 
                    currentStudent={editStudent}
                    onStudentUpdated={handleRefresh}
                />}
            </>}
        />
    );
}