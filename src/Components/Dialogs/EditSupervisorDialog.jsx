import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import Dialog from "./AbstractDialog";
import { clearControlDialog } from "@root/src/store/slices/controlDialogs.slice";
import { Button, Input, Dropdown, Option, tokens } from "@fluentui/react-components";
import { updateSupervisor, getSupervisorById } from "@root/src/services/people";
import Loading from "@PreMadeComponents/Loading";
import { academicRanks } from "@components/ControlPad/Supervisors";
import { getAllCollages, getDepartments } from "@root/src/services/collage";

export default function EditSupervisorDialog({ currentSupervisor, onSupervisorUpdated }) {
    const dispatch = useDispatch();
    
    // بيانات المشرف
    const [supervisorData, setSupervisorData] = useState({
        supervisor_name: '',
        supervisor_father_name: '',
        supervisor_grandfather_name: '',
        supervisor_family_name: '',
        supervisor_email: '',
        academic_rank: '',
        supervisor_full_name: ''
    });
    
    // الكليات والأقسام
    const [collages, setCollages] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedCollage, setSelectedCollage] = useState(null); // collage_id فقط
    const [selectedDepartment, setSelectedDepartment] = useState(null); // department_id فقط
    
    // حالة التحميل والأخطاء
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingSupervisor, setIsLoadingSupervisor] = useState(false);
    const [isLoadingCollages, setIsLoadingCollages] = useState(false);
    const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
    const [error, setError] = useState('');
    const [supervisorId, setSupervisorId] = useState('');

    // جلب بيانات المشرف من الخادم
    const fetchSupervisorData = useCallback(async (id) => {
        if (!id) return;
        
        setIsLoadingSupervisor(true);
        try {
            const res = await getSupervisorById(id);
            const supervisor = res.data?.result;
            
            if (supervisor) {
                // تخزين بيانات المشرف الأساسية
                setSupervisorData({
                    supervisor_name: supervisor.supervisor_name || '',
                    supervisor_father_name: supervisor.supervisor_father_name || '',
                    supervisor_grandfather_name: supervisor.supervisor_grandfather_name || '',
                    supervisor_family_name: supervisor.supervisor_family_name || '',
                    supervisor_email: supervisor.supervisor_email || '',
                    academic_rank: supervisor.supervisor_title || '',
                    supervisor_full_name: supervisor.supervisor_full_name || '',
                });
                
                setSupervisorId(supervisor.supervisor_id);
                
                // تحديد الكلية والقسم من بيانات المشرف
                if (supervisor.Department) {
                    // تحديد department_id
                    setSelectedDepartment(supervisor.Department.department_id);
                    
                    // تحديد collage_id من Department.Collage
                    if (supervisor.Department.Collage) {
                        setSelectedCollage(supervisor.Department.Collage.collage_id);
                        
                        // جلب الكليات والأقسام مع تحديد القيم الحالية
                        await fetchCollages(supervisor.Department.Collage.collage_id, supervisor.Department.department_id);
                    }
                }
            }
        } catch (err) {
            console.error('Error fetching supervisor data:', err);
            setError('فشل تحميل بيانات المشرف. يرجى المحاولة مرة أخرى');
        } finally {
            setIsLoadingSupervisor(false);
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

    // جلب بيانات المشرف عند التحميل
    useEffect(() => {
        if (currentSupervisor?.supervisor_id) {
            fetchSupervisorData(currentSupervisor.supervisor_id);
        }
    }, [currentSupervisor]);

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
        const { supervisor_name, supervisor_father_name, supervisor_grandfather_name, supervisor_family_name, supervisor_email, academic_rank } = supervisorData;
        
        // التحقق من الحقول المطلوبة
        if (!supervisor_name.trim()) {
            setError("اسم المشرف لا يمكن أن يكون فارغًا");
            return false;
        }
        if (!supervisor_father_name.trim()) {
            setError("اسم الأب لا يمكن أن يكون فارغًا");
            return false;
        }
        if (!supervisor_grandfather_name.trim()) {
            setError("اسم الجد لا يمكن أن يكون فارغًا");
            return false;
        }
        if (!supervisor_family_name.trim()) {
            setError("اسم العائلة لا يمكن أن يكون فارغًا");
            return false;
        }
        if (!academic_rank) {
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
        if (supervisor_email.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(supervisor_email.trim())) {
                setError("البريد الإلكتروني غير صالح");
                return false;
            }
        }

        // التحقق من صحة الأسماء (حروف عربية/إنجليزية فقط)
        const nameRegex = /^[A-Za-z\u0600-\u06FF]+$/;
        if (!nameRegex.test(supervisor_name.trim())) {
            setError("اسم المشرف يجب أن يحتوي على حروف فقط");
            return false;
        }
        if (!nameRegex.test(supervisor_father_name.trim())) {
            setError("اسم الأب يجب أن يحتوي على حروف فقط");
            return false;
        }
        if (!nameRegex.test(supervisor_grandfather_name.trim())) {
            setError("اسم الجد يجب أن يحتوي على حروف فقط");
            return false;
        }
        if (!nameRegex.test(supervisor_family_name.trim())) {
            setError("اسم العائلة يجب أن يحتوي على حروف فقط");
            return false;
        }

        setError('');
        return true;
    }, [supervisorData, selectedCollage, selectedDepartment]);

    const handleDone = useCallback(async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            const updateData = {
                name: supervisorData.supervisor_name.trim(),
                fatherName: supervisorData.supervisor_father_name.trim(),
                grandFatherName: supervisorData.supervisor_grandfather_name.trim(),
                familyName: supervisorData.supervisor_family_name.trim(),
                email: supervisorData.supervisor_email.trim() || null,
                title: supervisorData.academic_rank,
                departmentId: selectedDepartment
            };

            const res = await updateSupervisor(supervisorId, {
                ...updateData, 
                fullName: `${updateData.name} ${updateData.fatherName} ${updateData.grandFatherName} ${updateData.familyName}`
            });
            alert(`تم تحديث بيانات المشرف "${res.data?.result?.supervisor_full_name || supervisorData.supervisor_name}"`);
            
            // إغلاق الديالوج وتحديث القائمة
            if (onSupervisorUpdated) {
                onSupervisorUpdated();
            }
            dispatch(clearControlDialog());
            
        } catch (err) {
            console.error('Error updating supervisor:', err);
            const errorMessage = err.response?.data?.message || 'فشل تحديث بيانات المشرف. يرجى المحاولة مرة أخرى';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [supervisorData, selectedDepartment, supervisorId, validateForm, onSupervisorUpdated, dispatch]);

    const handleClose = useCallback(() => {
        if (!isLoading && !isLoadingSupervisor) {
            dispatch(clearControlDialog());
        }
    }, [dispatch, isLoading, isLoadingSupervisor]);

    const handleKeyUp = useCallback((e) => {
        if (e.key === 'Enter' && !isLoading) {
            handleDone();
        }
    }, [handleDone, isLoading]);

    const handleInputChange = useCallback((field) => (e) => {
        setSupervisorData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
        
        // مسح الخطأ عند البدء في الكتابة
        if (error) {
            setError('');
        }
    }, [error]);

    const handleAcademicRankChange = useCallback((_, data) => {
        setSupervisorData(prev => ({
            ...prev,
            academic_rank: data.selectedOptions[0] || ''
        }));
    }, []);

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
        supervisorData.supervisor_name.trim() && 
        supervisorData.supervisor_father_name.trim() && 
        supervisorData.supervisor_grandfather_name.trim() && 
        supervisorData.supervisor_family_name.trim() && 
        supervisorData.academic_rank &&
        selectedCollage && 
        selectedDepartment;

    // عرض الاسم الكامل بناءً على التغييرات
    const fullName = `${supervisorData.supervisor_name.trim()} ${supervisorData.supervisor_father_name.trim()} ${supervisorData.supervisor_grandfather_name.trim()} ${supervisorData.supervisor_family_name.trim()}`;

    // الحصول على أسماء الكلية والقسم المحددين للعرض
    const selectedCollageName = collages.find(c => c.collage_id === selectedCollage)?.collage_name || '';
    const selectedDepartmentName = departments.find(d => d.department_id === selectedDepartment)?.department_name || '';

    // حالة التحميل الإجمالية
    const isOverallLoading = isLoading || isLoadingSupervisor || isLoadingCollages || isLoadingDepartments;

    return (
        <Dialog
            style={{ width: '50%', maxWidth: '600px' }}
            title={'تعديل بيانات المشرف'}
            body={
                <DialogBody 
                    // بيانات المشرف
                    supervisorData={supervisorData}
                    fullName={fullName}
                    // الكليات والأقسام
                    collages={collages}
                    departments={departments}
                    selectedCollage={selectedCollage}
                    selectedDepartment={selectedDepartment}
                    selectedCollageName={selectedCollageName}
                    selectedDepartmentName={selectedDepartmentName}
                    // معالجات تغيير البيانات
                    onSupervisorNameChange={handleInputChange('supervisor_name')}
                    onSupervisorFatherNameChange={handleInputChange('supervisor_father_name')}
                    onSupervisorGrandfatherNameChange={handleInputChange('supervisor_grandfather_name')}
                    onSupervisorFamilyNameChange={handleInputChange('supervisor_family_name')}
                    onSupervisorEmailChange={handleInputChange('supervisor_email')}
                    onAcademicRankChange={handleAcademicRankChange}
                    onCollageChange={handleCollageChange}
                    onDepartmentChange={handleDepartmentChange}
                    // حالة التحميل
                    isLoadingSupervisor={isLoadingSupervisor}
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
    supervisorData,
    fullName,
    collages,
    departments,
    selectedCollage,
    selectedDepartment,
    selectedCollageName,
    selectedDepartmentName,
    onSupervisorNameChange,
    onSupervisorFatherNameChange,
    onSupervisorGrandfatherNameChange,
    onSupervisorFamilyNameChange,
    onSupervisorEmailChange,
    onAcademicRankChange,
    onCollageChange,
    onDepartmentChange,
    isLoadingSupervisor,
    isLoadingCollages,
    isLoadingDepartments,
    isLoading,
    error,
    onKeyUp
}) {
    const { supervisor_name, supervisor_father_name, supervisor_grandfather_name, supervisor_family_name, supervisor_email, academic_rank } = supervisorData;
    
    if (isLoadingSupervisor) {
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
                    جاري تحميل بيانات المشرف...
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
                تعديل بيانات المشرف
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
                        selectedOptions={academic_rank ? [academic_rank] : []}
                        onOptionSelect={onAcademicRankChange}
                        disabled={isLoading}
                        style={{ width: '100%' }}
                    >
                        {academicRanks.map(rank => (
                            <Option 
                                key={rank.id} 
                                value={rank.id}
                            >
                                {rank.name}
                            </Option>
                        ))}
                    </Dropdown>
                    {academic_rank && (
                        <div style={{ 
                            fontSize: '12px', 
                            color: '#666', 
                            marginTop: '4px'
                        }}>
                            الرتبة المحددة: <span style={{ color: tokens.colorBrandBackground }}>
                                {academic_rank}
                            </span>
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
                        value={supervisor_name}
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
                        value={supervisor_father_name}
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
                        value={supervisor_grandfather_name}
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
                        value={supervisor_family_name}
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
                        value={supervisor_email}
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
                    <span style={{ fontSize: '14px' }}>جاري تحديث بيانات المشرف...</span>
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