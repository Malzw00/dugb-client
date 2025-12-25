import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import Dialog from "./AbstractDialog";
import { clearControlDialog } from "@root/src/store/slices/controlDialogs.slice";
import { Button, Input, Dropdown, Option } from "@fluentui/react-components";
import { createStudent } from "@root/src/services/people";
import { getAllCollages, getDepartments } from "@root/src/services/collage";
import Loading from "@PreMadeComponents/Loading";

export default function AddStudentDialog({ onStudentAdded }) {
    const dispatch = useDispatch();
    
    // بيانات الطالب
    const [studentName, setStudentName] = useState('');
    const [studentFatherName, setStudentFatherName] = useState('');
    const [studentGrandfatherName, setStudentGrandfatherName] = useState('');
    const [studentFamilyName, setStudentFamilyName] = useState('');
    const [studentEmail, setStudentEmail] = useState('');
    
    // الكليات والأقسام
    const [collages, setCollages] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedCollage, setSelectedCollage] = useState(null); // كائن كلية كامل
    const [selectedDepartment, setSelectedDepartment] = useState(null); // كائن قسم كامل
    
    // حالة التحميل والأخطاء
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingCollages, setIsLoadingCollages] = useState(false);
    const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
    const [error, setError] = useState('');

    // جلب الكليات
    const fetchCollages = useCallback(async () => {
        setIsLoadingCollages(true);
        try {
            const res = await getAllCollages();
            setCollages(res.data?.result || []);
        } catch (err) {
            console.error('Error fetching collages:', err);
            setError('فشل تحميل الكليات. يرجى المحاولة مرة أخرى');
        } finally {
            setIsLoadingCollages(false);
        }
    }, []);

    // جلب الأقسام عند اختيار كلية
    const fetchDepartments = useCallback(async (collageId) => {
        if (!collageId) {
            setDepartments([]);
            return;
        }
        
        setIsLoadingDepartments(true);
        try {
            const res = await getDepartments(collageId);
            setDepartments(res.data?.result || []);
        } catch (err) {
            console.error('Error fetching departments:', err);
            setError('فشل تحميل الأقسام. يرجى المحاولة مرة أخرى');
        } finally {
            setIsLoadingDepartments(false);
        }
    }, []);

    // جلب الكليات عند التحميل
    useEffect(() => {
        fetchCollages();
    }, [fetchCollages]);

    // جلب الأقسام عند تغيير الكلية
    useEffect(() => {
        if (selectedCollage) {
            fetchDepartments(selectedCollage.collage_id);
            setSelectedDepartment(null); // إعادة تعيين القسم عند تغيير الكلية
        } else {
            setDepartments([]);
            setSelectedDepartment(null);
        }
    }, [selectedCollage, fetchDepartments]);

    const validateForm = useCallback(() => {
        // التحقق من الحقول المطلوبة
        if (!studentName.trim()) {
            setError("اسم الطالب لا يمكن أن يكون فارغًا");
            return false;
        }
        if (!studentFatherName.trim()) {
            setError("اسم الأب لا يمكن أن يكون فارغًا");
            return false;
        }
        if (!studentGrandfatherName.trim()) {
            setError("اسم الجد لا يمكن أن يكون فارغًا");
            return false;
        }
        if (!studentFamilyName.trim()) {
            setError("اسم العائلة لا يمكن أن يكون فارغًا");
            return false;
        }
        if (!selectedCollage) {
            setError("يرجى اختيار الكلية");
            return false;
        }
        if (!selectedDepartment) {
            setError("يرجى اختيار القسم");
            return false;
        }

        // التحقق من صحة البريد الإلكتروني (إذا تم إدخاله)
        if (studentEmail.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(studentEmail.trim())) {
                setError("البريد الإلكتروني غير صالح");
                return false;
            }
        }

        // التحقق من صحة الأسماء (حروف عربية/إنجليزية فقط)
        const nameRegex = /^[A-Za-z\u0600-\u06FF]+$/;
        if (!nameRegex.test(studentName.trim())) {
            setError("اسم الطالب يجب أن يحتوي على حروف فقط");
            return false;
        }
        if (!nameRegex.test(studentFatherName.trim())) {
            setError("اسم الأب يجب أن يحتوي على حروف فقط");
            return false;
        }
        if (!nameRegex.test(studentGrandfatherName.trim())) {
            setError("اسم الجد يجب أن يحتوي على حروف فقط");
            return false;
        }
        if (!nameRegex.test(studentFamilyName.trim())) {
            setError("اسم العائلة يجب أن يحتوي على حروف فقط");
            return false;
        }

        setError('');
        return true;
    }, [
        studentName, 
        studentFatherName, 
        studentGrandfatherName, 
        studentFamilyName, 
        studentEmail, 
        selectedCollage, 
        selectedDepartment
    ]);

    const handleDone = useCallback(async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            const studentData = {
                name: studentName.trim(),
                fatherName: studentFatherName.trim(),
                grandFatherName: studentGrandfatherName.trim(),
                familyName: studentFamilyName.trim(),
                email: studentEmail.trim() || null,
                departmentId: selectedDepartment.department_id,
                fullName: `${studentName.trim()} ${studentFatherName.trim()} ${studentGrandfatherName.trim()} ${studentFamilyName.trim()}`
            };
            
            const res = await createStudent(studentData);
            alert(`تم إنشاء الطالب "${res.data?.result?.student_full_name || studentName}"`);
            
            // تنظيف الحقول
            setStudentName('');
            setStudentFatherName('');
            setStudentGrandfatherName('');
            setStudentFamilyName('');
            setStudentEmail('');
            setSelectedCollage(null);
            setSelectedDepartment(null);
            setError('');
            
            // إغلاق الديالوج وتحديث القائمة
            if (onStudentAdded) {
                onStudentAdded();
            }
            dispatch(clearControlDialog());
            
        } catch (err) {
            console.error('Error creating student:', err);
            const errorMessage = err.response?.data?.message || 'فشل إنشاء الطالب. يرجى المحاولة مرة أخرى';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [
        studentName, 
        studentFatherName, 
        studentGrandfatherName, 
        studentFamilyName, 
        studentEmail, 
        selectedDepartment, 
        validateForm, 
        onStudentAdded, 
        dispatch
    ]);

    const handleClose = useCallback(() => {
        if (!isLoading) {
            dispatch(clearControlDialog());
        }
    }, [dispatch, isLoading]);

    const handleKeyUp = useCallback((e) => {
        if (e.key === 'Enter' && !isLoading) {
            handleDone();
        }
    }, [handleDone, isLoading]);

    const handleInputChange = useCallback((setter) => (e) => {
        setter(e.target.value);
        // مسح الخطأ عند البدء في الكتابة
        if (error) {
            setError('');
        }
    }, [error]);

    const handleCollageChange = useCallback((_, data) => {
        const selectedCollageObject = data.selectedOptions[0] || null;
        setSelectedCollage(selectedCollageObject);
    }, []);

    const handleDepartmentChange = useCallback((_, data) => {
        const selectedDepartmentObject = data.selectedOptions[0] || null;
        setSelectedDepartment(selectedDepartmentObject);
    }, []);

    // التحقق من صحة النموذج لإلغاء زر الإضافة
    const isFormValid = 
        studentName.trim() && 
        studentFatherName.trim() && 
        studentGrandfatherName.trim() && 
        studentFamilyName.trim() && 
        selectedCollage && 
        selectedDepartment;

    return (
        <Dialog
            style={{ width: '50%', maxWidth: '600px' }}
            title={'إضافة طالب جديد'}
            body={
                <DialogBody 
                    // بيانات الطالب
                    studentName={studentName}
                    studentFatherName={studentFatherName}
                    studentGrandfatherName={studentGrandfatherName}
                    studentFamilyName={studentFamilyName}
                    studentEmail={studentEmail}
                    // معالجات تغيير البيانات
                    onStudentNameChange={handleInputChange(setStudentName)}
                    onStudentFatherNameChange={handleInputChange(setStudentFatherName)}
                    onStudentGrandfatherNameChange={handleInputChange(setStudentGrandfatherName)}
                    onStudentFamilyNameChange={handleInputChange(setStudentFamilyName)}
                    onStudentEmailChange={handleInputChange(setStudentEmail)}
                    // الكليات والأقسام
                    collages={collages}
                    departments={departments}
                    selectedCollage={selectedCollage}
                    selectedDepartment={selectedDepartment}
                    onCollageChange={handleCollageChange}
                    onDepartmentChange={handleDepartmentChange}
                    // حالة التحميل
                    isLoadingCollages={isLoadingCollages}
                    isLoadingDepartments={isLoadingDepartments}
                    isLoading={isLoading}
                    // الخطأ
                    error={error}
                    // معالجات الأحداث
                    onKeyUp={handleKeyUp}
                />
            }
            onCloseBtnClick={handleClose}
            footer={
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: '5px' }}>
                    <Button 
                        appearance="secondary" 
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        إلغاء
                    </Button>
                    <Button 
                        appearance="primary" 
                        onClick={handleDone}
                        disabled={isLoading || !isFormValid}
                        icon={isLoading ? <Loading size="tiny" /> : undefined}
                    >
                        {isLoading ? 'جاري الإضافة...' : 'إضافة'}
                    </Button>
                </div>
            }
        />
    );
}

function DialogBody({ 
    studentName,
    studentFatherName,
    studentGrandfatherName,
    studentFamilyName,
    studentEmail,
    onStudentNameChange,
    onStudentFatherNameChange,
    onStudentGrandfatherNameChange,
    onStudentFamilyNameChange,
    onStudentEmailChange,
    collages,
    departments,
    selectedCollage,
    selectedDepartment,
    onCollageChange,
    onDepartmentChange,
    isLoadingCollages,
    isLoadingDepartments,
    isLoading,
    error,
    onKeyUp
}) {
    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            gap: '13px' 
        }}>
            <div style={{ 
                textAlign: 'center', 
                marginBottom: '12px',
                fontSize: '16px',
                fontWeight: '500'
            }}>
                أدخل بيانات الطالب
            </div>
            
            {/* الصف الأول: الكلية والقسم */}
            <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: '12px',
                alignItems: 'flex-start'
            }}>
                <div style={{ flex: '1', minWidth: '200px' }}>
                    <div style={{ 
                        display: 'block', 
                        fontSize: '14px', 
                        marginBottom: '4px',
                        fontWeight: '500'
                    }}>
                        الكلية *
                    </div>
                    <Dropdown
                        placeholder={isLoadingCollages ? "جاري تحميل الكليات..." : "اختر الكلية"}
                        selectedOptions={selectedCollage ? [selectedCollage] : []}
                        onOptionSelect={onCollageChange}
                        disabled={isLoading || isLoadingCollages}
                        style={{ width: '100%' }}
                    >
                        {collages.map(collage => (
                            <Option 
                                key={collage.collage_id} 
                                text={collage.collage_name}
                                value={collage}
                            >
                                {collage.collage_name}
                            </Option>
                        ))}
                    </Dropdown>
                    {selectedCollage && (
                        <div style={{ 
                            fontSize: '12px', 
                            color: '#666', 
                            marginTop: '4px'
                        }}>
                            الكلية المحددة: {selectedCollage.collage_name}
                        </div>
                    )}
                </div>
                
                <div style={{ flex: '1', minWidth: '200px' }}>
                    <div style={{ 
                        display: 'block', 
                        fontSize: '14px', 
                        marginBottom: '4px',
                        fontWeight: '500'
                    }}>
                        القسم *
                    </div>
                    <Dropdown
                        placeholder={
                            !selectedCollage ? "اختر الكلية أولاً" :
                            isLoadingDepartments ? "جاري تحميل الأقسام..." : "اختر القسم"
                        }
                        selectedOptions={selectedDepartment ? [selectedDepartment] : []}
                        onOptionSelect={onDepartmentChange}
                        disabled={isLoading || !selectedCollage || isLoadingDepartments}
                        style={{ width: '100%' }}
                    >
                        {departments.map(dept => (
                            <Option 
                                key={dept.department_id} 
                                text={dept.department_name}
                                value={dept}
                            >
                                {dept.department_name}
                            </Option>
                        ))}
                    </Dropdown>
                    {selectedDepartment && (
                        <div style={{ 
                            fontSize: '12px', 
                            color: '#666', 
                            marginTop: '4px'
                        }}>
                            القسم المحدد: {selectedDepartment.department_name}
                        </div>
                    )}
                </div>
            </div>

            {/* الصف الثاني: أسماء الطالب */}
            <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: '12px',
                alignItems: 'flex-start'
            }}>
                <div style={{ flex: '1', minWidth: '120px' }}>
                    <div style={{ 
                        display: 'block', 
                        fontSize: '14px', 
                        marginBottom: '4px',
                        fontWeight: '500'
                    }}>
                        الاسم الأول *
                    </div>
                    <Input
                        placeholder="الاسم الأول"
                        value={studentName}
                        onChange={onStudentNameChange}
                        onKeyUp={onKeyUp}
                        disabled={isLoading}
                        style={{ width: '100%' }}
                    />
                </div>
                
                <div style={{ flex: '1', minWidth: '120px' }}>
                    <div style={{ 
                        display: 'block', 
                        fontSize: '14px', 
                        marginBottom: '4px',
                        fontWeight: '500'
                    }}>
                        اسم الأب *
                    </div>
                    <Input
                        placeholder="اسم الأب"
                        value={studentFatherName}
                        onChange={onStudentFatherNameChange}
                        onKeyUp={onKeyUp}
                        disabled={isLoading}
                        style={{ width: '100%' }}
                    />
                </div>
                
                <div style={{ flex: '1', minWidth: '120px' }}>
                    <div style={{ 
                        display: 'block', 
                        fontSize: '14px', 
                        marginBottom: '4px',
                        fontWeight: '500'
                    }}>
                        اسم الجد *
                    </div>
                    <Input
                        placeholder="اسم الجد"
                        value={studentGrandfatherName}
                        onChange={onStudentGrandfatherNameChange}
                        onKeyUp={onKeyUp}
                        disabled={isLoading}
                        style={{ width: '100%' }}
                    />
                </div>
                
                <div style={{ flex: '1', minWidth: '120px' }}>
                    <div style={{ 
                        display: 'block', 
                        fontSize: '14px', 
                        marginBottom: '4px',
                        fontWeight: '500'
                    }}>
                        اسم العائلة *
                    </div>
                    <Input
                        placeholder="اسم العائلة"
                        value={studentFamilyName}
                        onChange={onStudentFamilyNameChange}
                        onKeyUp={onKeyUp}
                        disabled={isLoading}
                        style={{ width: '100%' }}
                    />
                </div>
            </div>

            {/* الصف الثالث: البريد الإلكتروني */}
            <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: '12px',
                alignItems: 'flex-start'
            }}>
                <div style={{ flex: '1', minWidth: '200px' }}>
                    <div style={{ 
                        display: 'block', 
                        fontSize: '14px', 
                        marginBottom: '4px',
                        fontWeight: '500'
                    }}>
                        البريد الإلكتروني (اختياري)
                    </div>
                    <Input
                        placeholder="example@university.edu"
                        value={studentEmail}
                        onChange={onStudentEmailChange}
                        onKeyUp={onKeyUp}
                        disabled={isLoading}
                        type="email"
                        style={{ width: '100%' }}
                    />
                </div>
            </div>

            {/* رسالة الخطأ */}
            {error && (
                <div style={{ 
                    marginTop: '8px', 
                    padding: '12px', 
                    backgroundColor: '#FEF2F2', 
                    color: '#DC2626', 
                    borderRadius: '4px',
                    fontSize: '14px',
                    lineHeight: '1.4'
                }}>
                    فشل إنشاء طالب، تأكد من عدم تكرار الإسم وصحة المدخلات.
                </div>
            )}

            {/* حالة التحميل */}
            {isLoading && (
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '8px', 
                    marginTop: '8px' 
                }}>
                    <span style={{ fontSize: '14px' }}>جاري إنشاء الطالب...</span>
                </div>
            )}

            {/* ملاحظة */}
            <div style={{ 
                marginTop: '8px',
                fontSize: '12px', 
                color: '#6B7280' 
            }}>
                * الحقول المطلوبة
            </div>
        </div>
    );
}