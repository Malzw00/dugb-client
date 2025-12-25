import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import Dialog from "./AbstractDialog";
import { clearControlDialog } from "@root/src/store/slices/controlDialogs.slice";
import { Button, Input, Dropdown, Option, tokens } from "@fluentui/react-components";
import { updateStudent, getStudentById } from "@root/src/services/people";
import { getAllCollages, getDepartments } from "@root/src/services/collage";
import Loading from "@PreMadeComponents/Loading";

export default function EditStudentDialog({ currentStudent, onStudentUpdated }) {
    const dispatch = useDispatch();
    
    // بيانات الطالب
    const [studentData, setStudentData] = useState({
        student_name: '',
        student_father_name: '',
        student_grandfather_name: '',
        student_family_name: '',
        student_email: '',
        student_full_name: ''
    });
    
    // الكليات والأقسام
    const [collages, setCollages] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedCollage, setSelectedCollage] = useState(null); // collage_id فقط
    const [selectedDepartment, setSelectedDepartment] = useState(null); // department_id فقط
    
    // حالة التحميل والأخطاء
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingStudent, setIsLoadingStudent] = useState(false);
    const [isLoadingCollages, setIsLoadingCollages] = useState(false);
    const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
    const [error, setError] = useState('');
    const [studentId, setStudentId] = useState('');

    // جلب بيانات الطالب من الخادم
    const fetchStudentData = useCallback(async (id) => {
        if (!id) return;
        
        setIsLoadingStudent(true);
        try {
            const res = await getStudentById(id);
            const student = res.data?.result;
            
            if (student) {
                // تخزين بيانات الطالب الأساسية
                setStudentData({
                    student_name: student.student_name || '',
                    student_father_name: student.student_father_name || '',
                    student_grandfather_name: student.student_grandfather_name || '',
                    student_family_name: student.student_family_name || '',
                    student_email: student.student_email || '',
                    student_full_name: student.student_full_name || '',
                });
                
                setStudentId(student.student_id);
                
                // تحديد الكلية والقسم من بيانات الطالب
                if (student.Department) {
                    // تحديد department_id
                    setSelectedDepartment(student.Department.department_id);
                    
                    // تحديد collage_id من Department.Collage
                    if (student.Department.Collage) {
                        setSelectedCollage(student.Department.Collage.collage_id);
                        
                        // جلب الكليات والأقسام مع تحديد القيم الحالية
                        await fetchCollages(student.Department.Collage.collage_id, student.Department.department_id);
                    }
                }
            }
        } catch (err) {
            console.error('Error fetching student data:', err);
            setError('فشل تحميل بيانات الطالب. يرجى المحاولة مرة أخرى');
        } finally {
            setIsLoadingStudent(false);
        }
    }, []);

    // جلب الكليات مع تحديد الكلية الحالية
    const fetchCollages = useCallback(async (currentCollageId = null, currentDepartmentId = null) => {
        setIsLoadingCollages(true);
        try {
            const res = await getAllCollages();
            const collagesData = res.data?.result || [];
            setCollages(collagesData);
            
            // تحديد الكلية الحالية إذا تم تمريرها
            if (currentCollageId) {
                setSelectedCollage(currentCollageId);
                
                // جلب أقسام الكلية الحالية
                await fetchDepartments(currentCollageId, currentDepartmentId);
            }
        } catch (err) {
            console.error('Error fetching collages:', err);
            setError('فشل تحميل الكليات. يرجى المحاولة مرة أخرى');
        } finally {
            setIsLoadingCollages(false);
        }
    }, []);

    // جلب الأقسام مع تحديد القسم الحالي
    const fetchDepartments = useCallback(async (collageId, currentDepartmentId = null) => {
        if (!collageId) {
            setDepartments([]);
            setSelectedDepartment(null);
            return;
        }
        
        setIsLoadingDepartments(true);
        try {
            const res = await getDepartments(collageId);
            const departmentsData = res.data?.result || [];
            setDepartments(departmentsData);
            
            // تحديد القسم الحالي إذا تم تمريره
            if (currentDepartmentId) {
                setSelectedDepartment(currentDepartmentId);
            }
        } catch (err) {
            console.error('Error fetching departments:', err);
            setError('فشل تحميل الأقسام. يرجى المحاولة مرة أخرى');
        } finally {
            setIsLoadingDepartments(false);
        }
    }, []);

    // جلب بيانات الطالب عند التحميل
    useEffect(() => {
        if (currentStudent?.student_id) {
            fetchStudentData(currentStudent.student_id);
        }
    }, [currentStudent]);

    // جلب الأقسام عند تغيير الكلية
    useEffect(() => {
        if (selectedCollage) {
            fetchDepartments(selectedCollage);
        } else {
            setDepartments([]);
            setSelectedDepartment(null);
        }
    }, [selectedCollage, fetchDepartments]);

    const validateForm = useCallback(() => {
        const { student_name, student_father_name, student_grandfather_name, student_family_name, student_email } = studentData;
        
        // التحقق من الحقول المطلوبة
        if (!student_name.trim()) {
            setError("اسم الطالب لا يمكن أن يكون فارغًا");
            return false;
        }
        if (!student_father_name.trim()) {
            setError("اسم الأب لا يمكن أن يكون فارغًا");
            return false;
        }
        if (!student_grandfather_name.trim()) {
            setError("اسم الجد لا يمكن أن يكون فارغًا");
            return false;
        }
        if (!student_family_name.trim()) {
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
        if (student_email.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(student_email.trim())) {
                setError("البريد الإلكتروني غير صالح");
                return false;
            }
        }

        // التحقق من صحة الأسماء (حروف عربية/إنجليزية فقط)
        const nameRegex = /^[A-Za-z\u0600-\u06FF]+$/;
        if (!nameRegex.test(student_name.trim())) {
            setError("اسم الطالب يجب أن يحتوي على حروف فقط");
            return false;
        }
        if (!nameRegex.test(student_father_name.trim())) {
            setError("اسم الأب يجب أن يحتوي على حروف فقط");
            return false;
        }
        if (!nameRegex.test(student_grandfather_name.trim())) {
            setError("اسم الجد يجب أن يحتوي على حروف فقط");
            return false;
        }
        if (!nameRegex.test(student_family_name.trim())) {
            setError("اسم العائلة يجب أن يحتوي على حروف فقط");
            return false;
        }

        setError('');
        return true;
    }, [studentData, selectedCollage, selectedDepartment]);

    const handleDone = useCallback(async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            const updateData = {
                name: studentData.student_name.trim(),
                fatherName: studentData.student_father_name.trim(),
                grandFatherName: studentData.student_grandfather_name.trim(),
                familyName: studentData.student_family_name.trim(),
                email: studentData.student_email.trim() || null,
                departmentId: selectedDepartment
            };

            const res = await updateStudent(studentId, {
                ...updateData, 
                fullName: `${updateData.name} ${updateData.fatherName} ${updateData.grandFatherName} ${updateData.familyName}`
            });
            alert(`تم تحديث بيانات الطالب "${res.data?.result?.student_full_name || studentData.student_name}"`);
            
            // إغلاق الديالوج وتحديث القائمة
            if (onStudentUpdated) {
                onStudentUpdated();
            }
            dispatch(clearControlDialog());
            
        } catch (err) {
            console.error('Error updating student:', err);
            const errorMessage = err.response?.data?.message || 'فشل تحديث بيانات الطالب. يرجى المحاولة مرة أخرى';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [studentData, selectedDepartment, studentId, validateForm, onStudentUpdated, dispatch]);

    const handleClose = useCallback(() => {
        if (!isLoading && !isLoadingStudent) {
            dispatch(clearControlDialog());
        }
    }, [dispatch, isLoading, isLoadingStudent]);

    const handleKeyUp = useCallback((e) => {
        if (e.key === 'Enter' && !isLoading) {
            handleDone();
        }
    }, [handleDone, isLoading]);

    const handleInputChange = useCallback((field) => (e) => {
        setStudentData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
        
        // مسح الخطأ عند البدء في الكتابة
        if (error) {
            setError('');
        }
    }, [error]);

    const handleCollageChange = useCallback((_, data) => {
        const selectedCollageId = data.selectedOptions[0] || null;
        setSelectedCollage(selectedCollageId);
        setSelectedDepartment(null); // إعادة تعيين القسم عند تغيير الكلية
    }, []);

    const handleDepartmentChange = useCallback((_, data) => {
        const selectedDepartmentId = data.selectedOptions[0] || null;
        setSelectedDepartment(selectedDepartmentId);
    }, []);

    // التحقق من صحة النموذج لإلغاء زر التعديل
    const isFormValid = 
        studentData.student_name.trim() && 
        studentData.student_father_name.trim() && 
        studentData.student_grandfather_name.trim() && 
        studentData.student_family_name.trim() && 
        selectedCollage && 
        selectedDepartment;

    // عرض الاسم الكامل بناءً على التغييرات
    const fullName = `${studentData.student_name.trim()} ${studentData.student_father_name.trim()} ${studentData.student_grandfather_name.trim()} ${studentData.student_family_name.trim()}`;

    // الحصول على أسماء الكلية والقسم المحددين للعرض
    const selectedCollageName = collages.find(c => c.collage_id === selectedCollage)?.collage_name || '';
    const selectedDepartmentName = departments.find(d => d.department_id === selectedDepartment)?.department_name || '';

    // حالة التحميل الإجمالية
    const isOverallLoading = isLoading || isLoadingStudent || isLoadingCollages || isLoadingDepartments;

    return (
        <Dialog
            style={{ width: '50%', maxWidth: '600px' }}
            title={'تعديل بيانات الطالب'}
            body={
                <DialogBody 
                    // بيانات الطالب
                    studentData={studentData}
                    fullName={fullName}
                    // معالجات تغيير البيانات
                    onStudentNameChange={handleInputChange('student_name')}
                    onStudentFatherNameChange={handleInputChange('student_father_name')}
                    onStudentGrandfatherNameChange={handleInputChange('student_grandfather_name')}
                    onStudentFamilyNameChange={handleInputChange('student_family_name')}
                    onStudentEmailChange={handleInputChange('student_email')}
                    // الكليات والأقسام
                    collages={collages}
                    departments={departments}
                    selectedCollage={selectedCollage}
                    selectedDepartment={selectedDepartment}
                    selectedCollageName={selectedCollageName}
                    selectedDepartmentName={selectedDepartmentName}
                    onCollageChange={handleCollageChange}
                    onDepartmentChange={handleDepartmentChange}
                    // حالة التحميل
                    isLoadingStudent={isLoadingStudent}
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
                        disabled={isOverallLoading}
                    >
                        إلغاء
                    </Button>
                    <Button 
                        appearance="primary" 
                        onClick={handleDone}
                        disabled={isOverallLoading || !isFormValid}
                        icon={isLoading ? <Loading size="tiny" /> : undefined}
                    >
                        {isLoading ? 'جاري التحديث...' : 'تحديث'}
                    </Button>
                </div>
            }
        />
    );
}

function DialogBody({ 
    studentData,
    fullName,
    onStudentNameChange,
    onStudentFatherNameChange,
    onStudentGrandfatherNameChange,
    onStudentFamilyNameChange,
    onStudentEmailChange,
    collages,
    departments,
    selectedCollage,
    selectedDepartment,
    selectedCollageName,
    selectedDepartmentName,
    onCollageChange,
    onDepartmentChange,
    isLoadingStudent,
    isLoadingCollages,
    isLoadingDepartments,
    isLoading,
    error,
    onKeyUp
}) {
    const { student_name, student_father_name, student_grandfather_name, student_family_name, student_email } = studentData;
    
    if (isLoadingStudent) {
        return (
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '20px', 
                padding: '40px 0' 
            }}>
                <Loading size="large" />
                <div style={{ fontSize: '16px', color: '#666' }}>
                    جاري تحميل بيانات الطالب...
                </div>
            </div>
        );
    }

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
                تعديل بيانات الطالب
            </div>
            
            {/* عرض الاسم الكامل المحدث */}
            <div style={{ 
                padding: '10px',
                backgroundColor: '#f0f9ff',
                borderRadius: '4px',
                border: '1px solid #bae6fd'
            }}>
                <div style={{ 
                    fontSize: '12px', 
                    color: '#666',
                    marginBottom: '4px'
                }}>
                    الاسم الكامل (سيتم تحديثه تلقائياً)
                </div>
                <div style={{ 
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#0369a1'
                }}>
                    {fullName}
                </div>
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
                                value={collage.collage_id}
                            >
                                {collage.collage_name}
                            </Option>
                        ))}
                    </Dropdown>
                    {selectedCollageName && (
                        <div style={{ 
                            fontSize: '12px', 
                            color: '#666', 
                            marginTop: '4px'
                        }}>
                            الكلية المحددة: <span style={{ color: tokens.colorBrandBackground }}>
                                {selectedCollageName}
                            </span>
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
                                value={dept.department_id}
                            >
                                {dept.department_name}
                            </Option>
                        ))}
                    </Dropdown>
                    {selectedDepartmentName && (
                        <div style={{ 
                            fontSize: '12px', 
                            color: '#666', 
                            marginTop: '4px'
                        }}>
                            القسم المحدد: <span style={{ color: tokens.colorBrandBackground }}>
                                {selectedDepartmentName}
                            </span>
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
                        value={student_name}
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
                        value={student_father_name}
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
                        value={student_grandfather_name}
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
                        value={student_family_name}
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
                        value={student_email}
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
                    فشل تحديث بيانات الطالب، تأكد من عدم تكرار الإسم وصحة المدخلات.
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
                    <span style={{ fontSize: '14px' }}>جاري تحديث بيانات الطالب...</span>
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