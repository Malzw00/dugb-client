import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dialog from "./AbstractDialog";
import { clearControlDialog } from "@root/src/store/slices/controlDialogs.slice";
import { Button, Input, Dropdown, Option, Textarea, tokens } from "@fluentui/react-components";
import { createProject } from "@services/project/project";
import Loading from "@PreMadeComponents/Loading";
import { setProjects } from "@root/src/store/slices/projects.slice";

export default function AddProjectDialog({ selectedCollage, departments }) {
    
    const dispatch = useDispatch();
    
    const projects = useSelector(state => state.projects?.value || []);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        year: new Date().getFullYear(),
        semester: 'spring',
        departmentId: null
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [semesterOptions] = useState([
        { value: 'spring', label: 'ربيع' },
        { value: 'autumn', label: 'خريف' },
    ]);
    
    // تلقائياً تحديد أول قسم إذا كان موجوداً
    useEffect(() => {
        if (departments?.length > 0 && !formData.departmentId) {
            setFormData(prev => ({
                ...prev,
                departmentId: departments[0].department_id
            }));
        }
    }, [departments, formData.departmentId]);

    const validateForm = useCallback(() => {
        const trimmedTitle = formData.title.trim();
        const trimmedDescription = formData.description.trim();

        if (!trimmedTitle) {
            setError("عنوان المشروع لا يمكن أن يكون فارغًا");
            return false;
        }

        if (trimmedTitle.length < 3) {
            setError("عنوان المشروع يجب أن يكون على الأقل 3 أحرف");
            return false;
        }

        if (!trimmedDescription) {
            setError("وصف المشروع لا يمكن أن يكون فارغًا");
            return false;
        }

        if (trimmedDescription.length < 10) {
            setError("وصف المشروع يجب أن يكون على الأقل 10 أحرف");
            return false;
        }

        if (!formData.departmentId) {
            setError("يجب اختيار القسم");
            return false;
        }

        if (!formData.year || formData.year < 2000 || formData.year > new Date().getFullYear() + 5) {
            setError("السنة غير صالحة. يجب أن تكون بين 2000 و " + (new Date().getFullYear() + 5));
            return false;
        }

        setError('');
        return true;
    }, [formData]);

    const handleDone = useCallback(async () => {
        if (!selectedCollage || !selectedCollage.collage_id) {
            setError("لم يتم تحديد كلية لإضافة المشروع إليها");
            return;
        }

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            const res = await createProject({
                title: formData.title.trim(),
                description: formData.description.trim(),
                date: new Date(`${formData.year}-01-01`).toISOString().split('T')[0], // YYYY-MM-DD
                semester: formData.semester,
                departmentId: formData.departmentId,
                supervisorId: null // يمكن إضافته لاحقاً
            });
            
            if (res.data?.success) {
                alert(`تم إنشاء مشروع "${res.data?.result?.project_title || formData.title}"`);
                
                // تحديث القائمة في المخزن
                const newProject = res.data?.result || { 
                    project_id: Date.now(), // مؤقت
                    project_title: formData.title.trim(),
                    description: formData.description.trim(),
                    semester: formData.semester,
                    department_id: formData.departmentId,
                    collage_id: selectedCollage.collage_id,
                    year: formData.year,
                    available: true
                };
                
                dispatch(setProjects([...projects, newProject]));
                
                // إعادة تعيين النموذج
                setFormData({
                    title: '',
                    description: '',
                    year: new Date().getFullYear(),
                    semester: 'spring',
                    departmentId: departments?.[0]?.department_id || null
                });
                setError('');
            } else {
                setError(res.data?.message || 'فشل إنشاء المشروع. يرجى المحاولة مرة أخرى');
            }
        } catch (err) {
            console.error('Error creating project:', err);
            setError('فشل إنشاء المشروع. يرجى المحاولة مرة أخرى');
        } finally {
            setIsLoading(false);
        }
    }, [formData, selectedCollage, projects, dispatch, departments, validateForm]);

    const handleClose = useCallback(() => {
        if (!isLoading) {
            dispatch(clearControlDialog());
        }
    }, [dispatch, isLoading]);

    const handleInputChange = useCallback((field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // مسح الخطأ عند بدء الكتابة
        if (error) {
            setError('');
        }
    }, [error]);

    const handleKeyUp = useCallback((e) => {
        if (e.key === 'Enter' && !isLoading) {
            handleDone();
        }
    }, [handleDone, isLoading]);

    // إذا لم تكن هناك كلية محددة، عرض رسالة خطأ
    if (!selectedCollage) {
        return (
            <Dialog
                style={{ minWidth: '35%' }}
                title={'إضافة مشروع'}
                body={
                    <div style={{ padding: '16px 0', textAlign: 'center', color: '#ef4444' }}>
                        لم يتم تحديد كلية لإضافة المشروع إليها
                    </div>
                }
                onCloseBtnClick={handleClose}
                footer={
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: '5px' }}>
                        <Button 
                            appearance="secondary" 
                            onClick={handleClose}
                        >
                            إغلاق
                        </Button>
                    </div>
                }
            />
        );
    }

    return (
        <Dialog
            style={{ width: '60%', minWidth: '500px' }}
            title={`توثيق مشروع جديد - ${selectedCollage.collage_name}`}
            body={
                <DialogBody 
                    formData={formData}
                    error={error}
                    isLoading={isLoading}
                    departments={departments}
                    semesterOptions={semesterOptions}
                    onInputChange={handleInputChange}
                    onKeyUp={handleKeyUp}
                    collageName={selectedCollage.collage_name}
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
                        disabled={isLoading || !formData.title.trim() || !formData.description.trim()}
                        icon={isLoading ? <Loading size="tiny" /> : undefined}
                    >
                        {isLoading ? 'جاري التوثيق...' : 'توثيق'}
                    </Button>
                </div>
            }
        />
    );
}

function DialogBody({ formData, error, isLoading, departments, semesterOptions, onInputChange, onKeyUp, collageName }) {
    
    const academicBoxStyle = { 
        padding: '8px 13px', 
        width: '50%', 
        border:'1px solid silver', 
        borderRadius: '5px', 
        background: tokens.colorNeutralBackground3 
    };

    const handleTextareaChange = useCallback((e) => {
        onInputChange('description', e.target.value);
    }, [onInputChange]);
    
    const handleYearChange = useCallback((e) => {
        const value = e.target.value;
        if (value === '' || /^\d{0,4}$/.test(value)) {
            onInputChange('year', value === '' ? '' : parseInt(value, 10));
        }
    }, [onInputChange]);
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '13px' }}>
            <div style={{ textAlign: 'center' }}>أدخل بيانات المشروع الجديد</div>
            
            <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', width: '100%' }}>
                {collageName && (
                    <div style={academicBoxStyle}>
                        الكلية المحددة: <br/>
                        <span style={{fontWeight:'bold'}}>{collageName}</span>
                    </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', ...academicBoxStyle }}>
                    <label style={{ fontSize: '14px', fontWeight: '500' }}>القسم *</label>
                    <Dropdown
                        style={{ width: '50%' }}
                        value={departments?.find(d => d.department_id === formData.departmentId)?.department_name || "اختر القسم"}
                        selectedOptions={formData.departmentId ? [formData.departmentId.toString()] : []}
                        onOptionSelect={(_, data) => {
                            if (data.selectedOptions[0]) {
                                onInputChange('departmentId', parseInt(data.selectedOptions[0], 10));
                            }
                        }}
                        placeholder="اختر القسم"
                        disabled={isLoading || !departments?.length}
                    >
                        {departments?.map((department) => (
                            <Option key={department.department_id} value={department.department_id.toString()}>
                                {department.department_name}
                            </Option>
                        ))}
                    </Dropdown>
                </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateRows: 'auto auto', gap: '13px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500' }}>عنوان المشروع *</label>
                        <Input
                            placeholder="أدخل عنوان المشروع"
                            value={formData.title}
                            onChange={(e) => onInputChange('title', e.target.value)}
                            onKeyUp={onKeyUp}
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500' }}>وصف المشروع *</label>
                        <Textarea
                            placeholder="أدخل وصف المشروع بالتفصيل"
                            value={formData.description}
                            onChange={handleTextareaChange}
                            onKeyUp={onKeyUp}
                            disabled={isLoading}
                            resize="vertical"
                            rows={6}
                            style={{ minHeight: '120px' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500' }}>السنة *</label>
                        <Input
                            placeholder="السنة (مثال: 2024)"
                            value={formData.year}
                            onChange={handleYearChange}
                            onKeyUp={onKeyUp}
                            disabled={isLoading}
                            type="number"
                            min="2000"
                            max={new Date().getFullYear() + 5}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500' }}>الفصل الدراسي *</label>
                        <Dropdown
                            value={semesterOptions.find(s => s.value === formData.semester)?.label || "اختر الفصل"}
                            selectedOptions={[formData.semester]}
                            onOptionSelect={(_, data) => {
                                if (data.selectedOptions[0]) {
                                    onInputChange('semester', data.selectedOptions[0]);
                                }
                            }}
                            placeholder="اختر الفصل الدراسي"
                            disabled={isLoading}
                        >
                            {semesterOptions.map((semester) => (
                                <Option key={semester.value} value={semester.value}>
                                    {semester.label}
                                </Option>
                            ))}
                        </Dropdown>
                    </div>
                </div>
            </div>
            
            {error && (
                <div style={{ marginTop: '8px', textAlign: 'center', color: '#ef4444', whiteSpace: 'pre-line' }}>
                    {error}
                </div>
            )}
            
            {isLoading && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '8px' }}>
                    <Loading size="small" />
                    <span>جاري توثيق المشروع...</span>
                </div>
            )}
            
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                * الحقول المميزة بعلامة النجمة إلزامية
            </div>
        </div>
    );
}