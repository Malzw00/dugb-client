import Body from "./Body";
import { useDispatch } from "react-redux";
import React, { useState, useCallback, useEffect } from "react";
import {  
    Input, 
    Dropdown, 
    Option, 
    Textarea, 
    tokens,
    Button,
} from "@fluentui/react-components";
import { updateProject, getProjectById } from "@services/project/project";
import { Folder32Regular } from "@fluentui/react-icons";
import { clearControlDialog } from "@root/src/store/slices/controlDialog.slice";

export default function ProjectDataBody({ currentProject, departments, selectedCollage }) {
    
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '', // تغيير من السنة فقط إلى تاريخ كامل
        semester: 'spring',
        department: null,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingProject, setIsLoadingProject] = useState(false);
    const [error, setError] = useState('');    
    const [semesterOptions] = useState([
        { value: 'spring', label: 'ربيع' },
        { value: 'autumn', label: 'خريف' },
    ]);
    
    useEffect(() => {
        if (currentProject?.project_id) {
            loadProjectData();
        }
    }, [currentProject]);
    
    const loadProjectData = async () => {
        setIsLoadingProject(true);
        try {
            const res = await getProjectById(currentProject.project_id);
            if (res.data?.success) {
                const projectData = res.data?.result || {};
                
                // تحويل التاريخ إلى تنسيق YYYY-MM-DD للعرض في حقل التاريخ
                let displayDate = '';
                if (projectData.project_date) {
                    if (typeof projectData.project_date === 'string') {
                        // إذا كان التاريخ في صيغة نصية
                        const dateObj = new Date(projectData.project_date);
                        if (!isNaN(dateObj.getTime())) {
                            displayDate = dateObj.toISOString().split('T')[0];
                        }
                    } else if (typeof projectData.project_date === 'number') {
                        // إذا كان التاريخ سنة فقط (رقم)
                        displayDate = `${projectData.project_date}-01-01`;
                    }
                }
                
                // تعبئة البيانات الأساسية
                setFormData({
                    title: projectData.project_title || '',
                    description: projectData.project_description || '',
                    date: displayDate, // استخدام التاريخ المحول
                    semester: projectData.project_semester || 'spring',
                    department: projectData.Department || null,
                });
            }
        } catch (err) {
            console.error('Error loading project:', err);
            setError('فشل تحميل بيانات المشروع');
        } finally {
            setIsLoadingProject(false);
        }
    };
    
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

        if (!formData.department) {
            setError("يجب اختيار القسم");
            return false;
        }

        // التحقق من صحة التاريخ
        if (!formData.date) {
            setError("يجب إدخال تاريخ المشروع");
            return false;
        }

        const dateObj = new Date(formData.date);
        if (isNaN(dateObj.getTime())) {
            setError("التاريخ غير صالح");
            return false;
        }

        const year = dateObj.getFullYear();
        if (year < 2000 || year > new Date().getFullYear() + 5) {
            setError(`السنة غير صالحة. يجب أن تكون بين 2000 و ${new Date().getFullYear() + 5}`);
            return false;
        }

        setError('');
        return true;
    }, [formData]);

    const handleDone = useCallback(async () => {
        if (!selectedCollage || !selectedCollage.collage_id) {
            setError("لم يتم تحديد كلية");
            return;
        }

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            const dateObj = new Date(formData.date);

            const updateData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                date: dateObj,
                semester: formData.semester,
                departmentId: formData.department.department_id,
            };
            
            const res = await updateProject(currentProject.project_id, updateData);
            
            if (res.data?.success) {
                alert(`تم تحديث مشروع "${res.data?.result?.project_title || formData.title}"`);
                setError('');
            } else {
                setError(res.data?.message || 'فشل تحديث المشروع. يرجى المحاولة مرة أخرى');
            }
        } catch (err) {
            console.error('Error updating project:', err);
            setError('فشل تحديث المشروع. يرجى المحاولة مرة أخرى');
        } finally {
            setIsLoading(false);
        }
    }, [formData, selectedCollage, currentProject, validateForm]);

    const handleInputChange = useCallback((field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        if (error) {
            setError('');
        }
    }, [error]);

    const handleCloseDialog = useCallback(() => {
        if (!isLoading && !isLoadingProject) {
            dispatch(clearControlDialog());
        }
    }, [dispatch, isLoading, isLoadingProject]);

    return <Body
        style={{ flex: '1' }}
        icon={<Folder32Regular/>}
        title={'البيانات الأساسية'}
        content={<Content
            formData={formData}
            error={error}
            isLoading={isLoading}
            departments={departments}
            semesterOptions={semesterOptions}
            onInputChange={handleInputChange}
        />}
        footer={<div className="flex-row gap-5px justify-end">
            <Button appearance="secondary" onClick={handleCloseDialog}>إلغاء</Button>
            <Button appearance="primary" onClick={handleDone}>تعديل</Button>
        </div>}
    />
}



function Content({ 
    formData, 
    error, 
    isLoading, 
    departments, 
    semesterOptions, 
    onInputChange,
}) {

    const sectionStyle = {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '20px',
        padding: '15px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        backgroundColor: tokens.colorNeutralBackground2,
        flex: '1'
    };

    const handleTextareaChange = useCallback((e) => {
        onInputChange('description', e.target.value);
    }, [onInputChange]);
    
    const handleDateChange = useCallback((e) => {
        onInputChange('date', e.target.value);
    }, [onInputChange]);
    
    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '20px',
            paddingRight: '16px',
            flex: '1'
        }}>            
            {/* القسم 1: المعلومات الأساسية */}
            <div style={sectionStyle}>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', flex:'1', gap: '15px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={{ fontSize: '14px', fontWeight: '500' }}>عنوان المشروع *</label>
                            <Input
                                placeholder="أدخل عنوان المشروع"
                                value={formData.title}
                                onChange={(e) => onInputChange('title', e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <label style={{ fontSize: '14px', fontWeight: '500' }}>تاريخ المشروع *</label>
                                <Input
                                    placeholder="تاريخ المشروع"
                                    value={formData.date}
                                    onChange={handleDateChange}
                                    disabled={isLoading}
                                    type="date"
                                />
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <label style={{ fontSize: '14px', fontWeight: '500' }}>الفصل الدراسي *</label>
                                <Dropdown
                                    value={semesterOptions.find(s => 
                                        s.value === formData.semester?.toLowerCase()
                                    )?.label || formData.semester}
                                    selectedOptions={[formData.semester?.toLowerCase()]}
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
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={{ fontSize: '14px', fontWeight: '500' }}>القسم *</label>
                            <Dropdown
                                value={formData.department?.department_name || "اختر القسم"}
                                selectedOptions={formData.department ? [formData.department.department_id.toString()] : []}
                                onOptionSelect={(_, data) => {
                                    if (data.selectedOptions[0]) {
                                        const selectedDept = departments?.find(
                                            d => d.department_id.toString() === data.selectedOptions[0]
                                        );
                                        if (selectedDept) {
                                            onInputChange('department', selectedDept);
                                        }
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
                </div>
                
                <div style={{ flex: '1' , display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500' }}>وصف المشروع *</label>
                    <Textarea
                        placeholder="أدخل وصف المشروع بالتفصيل"
                        value={formData.description}
                        onChange={handleTextareaChange}
                        disabled={isLoading}
                        resize="vertical"
                        rows={4}
                        style={{ minHeight: '100px', flex: '1' }}
                    />
                </div>
            </div>
            
            {error && (
                <div style={{ marginTop: '8px', textAlign: 'center', color: '#ef4444', whiteSpace: 'pre-line' }}>
                    {error}
                </div>
            )}
        </div>
    );
}