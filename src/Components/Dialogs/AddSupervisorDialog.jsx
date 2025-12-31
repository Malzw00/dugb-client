import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import Dialog from "./AbstractDialog";
import { clearControlDialog } from "@root/src/store/slices/controlDialog.slice";
import { Button, Input, Dropdown, Option } from "@fluentui/react-components";
import { createSupervisor } from "@root/src/services/people";
import Loading from "@PreMadeComponents/Loading";
import { academicRanks } from "@components/ControlPad/Supervisors";
import { getAllCollages, getDepartments } from "@root/src/services/collage";

export default function AddSupervisorDialog({ onSupervisorAdded }) {
    const dispatch = useDispatch();
    
    // بيانات المشرف
    const [supervisorName, setSupervisorName] = useState('');
    const [supervisorFatherName, setSupervisorFatherName] = useState('');
    const [supervisorGrandfatherName, setSupervisorGrandfatherName] = useState('');
    const [supervisorFamilyName, setSupervisorFamilyName] = useState('');
    const [supervisorEmail, setSupervisorEmail] = useState('');
    const [supervisorTitle, setSupervisorTitle] = useState('');
    
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
        if (!supervisorName.trim()) {
            setError("اسم المشرف لا يمكن أن يكون فارغًا");
            return false;
        }
        if (!supervisorFatherName.trim()) {
            setError("اسم الأب لا يمكن أن يكون فارغًا");
            return false;
        }
        if (!supervisorGrandfatherName.trim()) {
            setError("اسم الجد لا يمكن أن يكون فارغًا");
            return false;
        }
        if (!supervisorFamilyName.trim()) {
            setError("اسم العائلة لا يمكن أن يكون فارغًا");
            return false;
        }
        if (!supervisorTitle) {
            setError("يرجى اختيار الرتبة الأكاديمية");
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
        if (supervisorEmail.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(supervisorEmail.trim())) {
                setError("البريد الإلكتروني غير صالح");
                return false;
            }
        }

        // التحقق من صحة الأسماء (حروف عربية/إنجليزية فقط)
        const nameRegex = /^[A-Za-z\u0600-\u06FF]+$/;
        if (!nameRegex.test(supervisorName.trim())) {
            setError("اسم المشرف يجب أن يحتوي على حروف فقط");
            return false;
        }
        if (!nameRegex.test(supervisorFatherName.trim())) {
            setError("اسم الأب يجب أن يحتوي على حروف فقط");
            return false;
        }
        if (!nameRegex.test(supervisorGrandfatherName.trim())) {
            setError("اسم الجد يجب أن يحتوي على حروف فقط");
            return false;
        }
        if (!nameRegex.test(supervisorFamilyName.trim())) {
            setError("اسم العائلة يجب أن يحتوي على حروف فقط");
            return false;
        }

        setError('');
        return true;
    }, [
        supervisorName, 
        supervisorFatherName, 
        supervisorGrandfatherName, 
        supervisorFamilyName, 
        supervisorEmail, 
        supervisorTitle,
        selectedCollage,
        selectedDepartment
    ]);

    const handleDone = useCallback(async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            const supervisorData = {
                name: supervisorName.trim(),
                fatherName: supervisorFatherName.trim(),
                grandFatherName: supervisorGrandfatherName.trim(),
                familyName: supervisorFamilyName.trim(),
                email: supervisorEmail.trim() || null,
                title: supervisorTitle,
                departmentId: selectedDepartment.department_id,
                fullName: `${supervisorName.trim()} ${supervisorFatherName.trim()} ${supervisorGrandfatherName.trim()} ${supervisorFamilyName.trim()}`
            };
            
            const res = await createSupervisor(supervisorData);
            alert(`تم إنشاء المشرف "${res.data?.result?.supervisor_full_name || supervisorName}"`);
            
            // تنظيف الحقول
            setSupervisorName('');
            setSupervisorFatherName('');
            setSupervisorGrandfatherName('');
            setSupervisorFamilyName('');
            setSupervisorEmail('');
            setSupervisorTitle('');
            setSelectedCollage(null);
            setSelectedDepartment(null);
            setError('');
            
            // إغلاق الديالوج وتحديث القائمة
            if (onSupervisorAdded) {
                onSupervisorAdded();
            }
            dispatch(clearControlDialog());
            
        } catch (err) {
            console.error('Error creating supervisor:', err);
            const errorMessage = 'فشل إنشاء المشرف. يرجى المحاولة مرة أخرى';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [
        supervisorName, 
        supervisorFatherName, 
        supervisorGrandfatherName, 
        supervisorFamilyName, 
        supervisorEmail, 
        supervisorTitle,
        selectedDepartment,
        validateForm, 
        onSupervisorAdded, 
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

    const handleAcademicRankChange = useCallback((_, data) => {
        setSupervisorTitle(data.selectedOptions[0] || '');
    }, []);

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
        supervisorName.trim() && 
        supervisorFatherName.trim() && 
        supervisorGrandfatherName.trim() && 
        supervisorFamilyName.trim() && 
        supervisorTitle &&
        selectedCollage &&
        selectedDepartment;

    return (
        <Dialog
            style={{ width: '50%', maxWidth: '600px' }}
            title={'إضافة مشرف جديد'}
            body={
                <DialogBody 
                    // بيانات المشرف
                    supervisorName={supervisorName}
                    supervisorFatherName={supervisorFatherName}
                    supervisorGrandfatherName={supervisorGrandfatherName}
                    supervisorFamilyName={supervisorFamilyName}
                    supervisorEmail={supervisorEmail}
                    academicRank={supervisorTitle}
                    // الكليات والأقسام
                    collages={collages}
                    departments={departments}
                    selectedCollage={selectedCollage}
                    selectedDepartment={selectedDepartment}
                    academicRanks={academicRanks}
                    // معالجات تغيير البيانات
                    onSupervisorNameChange={handleInputChange(setSupervisorName)}
                    onSupervisorFatherNameChange={handleInputChange(setSupervisorFatherName)}
                    onSupervisorGrandfatherNameChange={handleInputChange(setSupervisorGrandfatherName)}
                    onSupervisorFamilyNameChange={handleInputChange(setSupervisorFamilyName)}
                    onSupervisorEmailChange={handleInputChange(setSupervisorEmail)}
                    onAcademicRankChange={handleAcademicRankChange}
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
    supervisorName,
    supervisorFatherName,
    supervisorGrandfatherName,
    supervisorFamilyName,
    supervisorEmail,
    academicRank,
    academicRanks,
    collages,
    departments,
    selectedCollage,
    selectedDepartment,
    onSupervisorNameChange,
    onSupervisorFatherNameChange,
    onSupervisorGrandfatherNameChange,
    onSupervisorFamilyNameChange,
    onSupervisorEmailChange,
    onAcademicRankChange,
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
                أدخل بيانات المشرف
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

            {/* الصف الثاني: الرتبة الأكاديمية */}
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
                        الرتبة الأكاديمية *
                    </div>
                    <Dropdown
                        placeholder="اختر الرتبة الأكاديمية"
                        selectedOptions={academicRank ? [academicRank] : []}
                        onOptionSelect={onAcademicRankChange}
                        disabled={isLoading}
                        style={{ width: '100%' }}
                    >
                        {academicRanks.map(rank => (
                            <Option 
                                key={rank.id} 
                                text={rank.name}
                                value={rank.id}
                            >
                                {rank.name}
                            </Option>
                        ))}
                    </Dropdown>
                    {academicRank && (
                        <div style={{ 
                            fontSize: '12px', 
                            color: '#666', 
                            marginTop: '4px'
                        }}>
                            الرتبة المحددة: {academicRank}
                        </div>
                    )}
                </div>
            </div>

            {/* الصف الثالث: أسماء المشرف */}
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
                        value={supervisorName}
                        onChange={onSupervisorNameChange}
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
                        value={supervisorFatherName}
                        onChange={onSupervisorFatherNameChange}
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
                        value={supervisorGrandfatherName}
                        onChange={onSupervisorGrandfatherNameChange}
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
                        value={supervisorFamilyName}
                        onChange={onSupervisorFamilyNameChange}
                        onKeyUp={onKeyUp}
                        disabled={isLoading}
                        style={{ width: '100%' }}
                    />
                </div>
            </div>

            {/* الصف الرابع: البريد الإلكتروني */}
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
                        value={supervisorEmail}
                        onChange={onSupervisorEmailChange}
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
                    {error}
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
                    <span style={{ fontSize: '14px' }}>جاري إنشاء المشرف...</span>
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