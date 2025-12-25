import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dialog from "./AbstractDialog";
import { clearControlDialog } from "@root/src/store/slices/controlDialogs.slice";
import { 
    Button, 
    Input, 
    Dropdown, 
    Option, 
    Textarea, 
    tokens,
    Tag,
    Avatar,
    Badge
} from "@fluentui/react-components";
import { updateProject, getProjectById } from "@services/project/project";
import Loading from "@PreMadeComponents/Loading";
import { setProjects } from "@root/src/store/slices/projects.slice";
import {
    Add20Regular,
    Delete20Regular,
    Document20Regular,
    People20Regular,
    Book20Regular,
    Tag20Regular,
    Folder20Regular
} from "@fluentui/react-icons";

export default function EditProjectDialog({ selectedCollage, departments, currentProject }) {
    
    const dispatch = useDispatch();
    
    const projects = useSelector(state => state.projects?.value || []);
    const collages = useSelector(state => state.collages?.value || []);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        year: new Date().getFullYear(),
        semester: 'spring',
        departmentId: null,
        supervisorId: null,
        supervisorName: '',
        available: true
    });
    
    const [additionalData, setAdditionalData] = useState({
        pdfFile: null,
        pdfFileName: '',
        presentationFile: null,
        presentationFileName: '',
        students: [],
        references: [],
        categories: [],
        keywords: []
    });
    
    const [newStudent, setNewStudent] = useState('');
    const [newReference, setNewReference] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [newKeyword, setNewKeyword] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingProject, setIsLoadingProject] = useState(false);
    const [error, setError] = useState('');
    
    const [semesterOptions] = useState([
        { value: 'spring', label: 'ربيع' },
        { value: 'autumn', label: 'خريف' },
    ]);
    
    // تحميل بيانات المشروع عند فتح الديالوج
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
                const projectData = res.data.result;
                
                // تعبئة البيانات الأساسية
                setFormData({
                    title: projectData.project_title || '',
                    description: projectData.description || '',
                    year: projectData.year || new Date().getFullYear(),
                    semester: projectData.semester || 'spring',
                    departmentId: projectData.department_id || null,
                    supervisorId: projectData.supervisor_id || null,
                    supervisorName: projectData.supervisor_name || '',
                    available: projectData.available !== false
                });
                
                // تعبئة البيانات الإضافية (هذه أمثلة، يجب تكييفها مع هيكل API الخاص بك)
                setAdditionalData({
                    pdfFile: null,
                    pdfFileName: projectData.pdf_file_name || '',
                    presentationFile: null,
                    presentationFileName: projectData.presentation_file_name || '',
                    students: projectData.students || [],
                    references: projectData.references || [],
                    categories: projectData.categories || [],
                    keywords: projectData.keywords || []
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
            setError("لم يتم تحديد كلية");
            return;
        }

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            const updateData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                date: new Date(`${formData.year}-01-01`).toISOString().split('T')[0],
                semester: formData.semester,
                departmentId: formData.departmentId,
                supervisorId: formData.supervisorId || null,
                available: formData.available
            };
            
            const res = await updateProject(currentProject.project_id, updateData);
            
            if (res.data?.success) {
                alert(`تم تحديث مشروع "${res.data?.result?.project_title || formData.title}"`);
                
                // تحديث القائمة في المخزن
                const updatedProjects = projects.map(p => 
                    p.project_id === currentProject.project_id 
                        ? { ...p, ...res.data.result }
                        : p
                );
                
                dispatch(setProjects(updatedProjects));
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
    }, [formData, selectedCollage, currentProject, projects, dispatch, validateForm]);

    const handleClose = useCallback(() => {
        if (!isLoading && !isLoadingProject) {
            dispatch(clearControlDialog());
        }
    }, [dispatch, isLoading, isLoadingProject]);

    const handleInputChange = useCallback((field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        if (error) {
            setError('');
        }
    }, [error]);

    const handleKeyUp = useCallback((e) => {
        if (e.key === 'Enter' && !isLoading) {
            handleDone();
        }
    }, [handleDone, isLoading]);

    // معالجة الملفات
    const handleFileUpload = (fileType, event) => {
        const file = event.target.files[0];
        if (file) {
            if (fileType === 'pdf') {
                setAdditionalData(prev => ({
                    ...prev,
                    pdfFile: file,
                    pdfFileName: file.name
                }));
            } else if (fileType === 'presentation') {
                setAdditionalData(prev => ({
                    ...prev,
                    presentationFile: file,
                    presentationFileName: file.name
                }));
            }
        }
    };

    const handleRemoveFile = (fileType) => {
        if (fileType === 'pdf') {
            setAdditionalData(prev => ({
                ...prev,
                pdfFile: null,
                pdfFileName: ''
            }));
        } else if (fileType === 'presentation') {
            setAdditionalData(prev => ({
                ...prev,
                presentationFile: null,
                presentationFileName: ''
            }));
        }
    };

    // إدارة الطلبة - تغيير إلى زر تحديد
    const handleSelectStudents = () => {
        // TODO: سيتم تصميم ديالوق خاص لعرض الطلبة وتحديدهم لاحقاً
        console.log('فتح ديالوق تحديد الطلبة');
    };

    // إدارة المراجع - تغيير إلى زر تحديد
    const handleSelectReferences = () => {
        // TODO: سيتم تصميم ديالوق خاص لعرض المراجع وتحديدها لاحقاً
        console.log('فتح ديالوق تحديد المراجع');
    };

    // إدارة الفئات - تغيير إلى Dropdown متعدد التحديد
    const handleCategorySelect = (_, data) => {
        const selectedCategories = data.selectedOptions.map(option => option);
        setAdditionalData(prev => ({
            ...prev,
            categories: selectedCategories
        }));
    };

    // إدارة الكلمات المفتاحية
    const handleAddKeyword = () => {
        if (newKeyword.trim()) {
            setAdditionalData(prev => ({
                ...prev,
                keywords: [...prev.keywords, newKeyword.trim()]
            }));
            setNewKeyword('');
        }
    };

    const handleRemoveKeyword = (index) => {
        setAdditionalData(prev => ({
            ...prev,
            keywords: prev.keywords.filter((_, i) => i !== index)
        }));
    };

    if (!selectedCollage || !currentProject) {
        return (
            <Dialog
                style={{ minWidth: '35%' }}
                title={'تعديل مشروع'}
                body={
                    <div style={{ padding: '16px 0', textAlign: 'center', color: '#ef4444' }}>
                        {!selectedCollage ? 'لم يتم تحديد كلية' : 'لم يتم تحديد مشروع للتعديل'}
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

    if (isLoadingProject) {
        return (
            <Dialog
                style={{ minWidth: '35%' }}
                title={'تعديل مشروع'}
                body={
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                        <Loading size="medium" />
                        <div style={{ marginTop: '16px' }}>جاري تحميل بيانات المشروع...</div>
                    </div>
                }
                onCloseBtnClick={handleClose}
                footer={
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: '5px' }}>
                        <Button 
                            appearance="secondary" 
                            onClick={handleClose}
                            disabled={true}
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
            style={{ width: '80%', minWidth: '700px', maxHeight: '90vh' }}
            title={`تعديل مشروع - ${currentProject.project_title || 'بدون عنوان'}`}
            body={
                <DialogBody 
                    formData={formData}
                    additionalData={additionalData}
                    error={error}
                    isLoading={isLoading}
                    departments={departments}
                    semesterOptions={semesterOptions}
                    onInputChange={handleInputChange}
                    // // onKeyUp={onKeyUp}
                    collageName={selectedCollage.collage_name}
                    currentProject={currentProject}
                    
                    // File handlers
                    onFileUpload={handleFileUpload}
                    onRemoveFile={handleRemoveFile}
                    
                    // Student handlers
                    onSelectStudents={handleSelectStudents}
                    onRemoveStudent={(index) => {
                        setAdditionalData(prev => ({
                            ...prev,
                            students: prev.students.filter((_, i) => i !== index)
                        }));
                    }}
                    
                    // Reference handlers
                    onSelectReferences={handleSelectReferences}
                    onRemoveReference={(index) => {
                        setAdditionalData(prev => ({
                            ...prev,
                            references: prev.references.filter((_, i) => i !== index)
                        }));
                    }}
                    
                    // Category handlers
                    onCategorySelect={handleCategorySelect}
                    
                    // Keyword handlers
                    newKeyword={newKeyword}
                    setNewKeyword={setNewKeyword}
                    onAddKeyword={handleAddKeyword}
                    onRemoveKeyword={handleRemoveKeyword}
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
                        disabled={isLoading}
                        icon={isLoading ? <Loading size="tiny" /> : undefined}
                    >
                        {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                    </Button>
                </div>
            }
        />
    );
}

function DialogBody({ 
    formData, 
    additionalData,
    error, 
    isLoading, 
    departments, 
    semesterOptions, 
    onInputChange, 
    onKeyUp, 
    collageName,
    currentProject,
    
    // File handlers
    onFileUpload,
    onRemoveFile,
    
    // Student handlers
    onSelectStudents,
    onRemoveStudent,
    
    // Reference handlers
    onSelectReferences,
    onRemoveReference,
    
    // Category handlers
    onCategorySelect,
    
    // Keyword handlers
    newKeyword,
    setNewKeyword,
    onAddKeyword,
    onRemoveKeyword
}) {

    const sectionStyle = {
        marginBottom: '20px',
        padding: '15px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        backgroundColor: tokens.colorNeutralBackground1
    };

    const sectionTitleStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '16px',
        fontWeight: '600',
        marginBottom: '15px',
        color: tokens.colorNeutralForeground1
    };

    const tagContainerStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginTop: '10px'
    };

    const tagStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        backgroundColor: tokens.colorNeutralBackground3,
        borderRadius: '15px',
        fontSize: '14px'
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
    
    const categoryOptions = [
        { value: 'ai', label: 'الذكاء الاصطناعي' },
        { value: 'web', label: 'تطوير الويب' },
        { value: 'mobile', label: 'تطبيقات الجوال' },
        { value: 'security', label: 'الأمن السيبراني' },
        { value: 'data', label: 'علم البيانات' },
        { value: 'network', label: 'الشبكات' },
        { value: 'database', label: 'قواعد البيانات' },
        { value: 'cloud', label: 'الحوسبة السحابية' },
    ];
    
    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '20px',
            maxHeight: '70vh',
            overflowY: 'auto',
            paddingRight: '10px'
        }}>
            <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: '500' }}>
                تعديل بيانات المشروع
            </div>
            
            {/* القسم 1: المعلومات الأساسية */}
            <div style={sectionStyle}>
                <div style={sectionTitleStyle}>
                    <Folder20Regular />
                    المعلومات الأساسية
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={{ fontSize: '14px', fontWeight: '500' }}>عنوان المشروع *</label>
                            <Input
                                placeholder="أدخل عنوان المشروع"
                                value={formData.title}
                                onChange={(e) => onInputChange('title', e.target.value)}
                                // onKeyUp={onKeyUp}
                                disabled={isLoading}
                            />
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <label style={{ fontSize: '14px', fontWeight: '500' }}>السنة *</label>
                                <Input
                                    placeholder="السنة (مثال: 2024)"
                                    value={formData.year}
                                    onChange={handleYearChange}
                                    // onKeyUp={onKeyUp}
                                    disabled={isLoading}
                                    type="number"
                                    min="2000"
                                    max={new Date().getFullYear() + 5}
                                />
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
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
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={{ fontSize: '14px', fontWeight: '500' }}>القسم *</label>
                            <Dropdown
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
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={{ fontSize: '14px', fontWeight: '500' }}>المشرف</label>
                            <Dropdown 
                                placeholder="حدد المشرف (اختياري)">

                            </Dropdown>
                        </div>
                    </div>
                </div>
                
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500' }}>وصف المشروع *</label>
                    <Textarea
                        placeholder="أدخل وصف المشروع بالتفصيل"
                        value={formData.description}
                        onChange={handleTextareaChange}
                        // onKeyUp={onKeyUp}
                        disabled={isLoading}
                        resize="vertical"
                        rows={4}
                        style={{ minHeight: '100px' }}
                    />
                </div>
            </div>
            
            {/* القسم 2: الملفات */}
            <div style={sectionStyle}>
                <div style={sectionTitleStyle}>
                    <Document20Regular />
                    الملفات
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    {/* ملف PDF */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '500' }}>
                            <Document20Regular style={{ marginRight: '6px' }} />
                            الكتاب (PDF)
                        </div>
                        
                        {additionalData.pdfFileName ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Badge appearance="filled" color="success" shape="rounded">
                                    {additionalData.pdfFileName}
                                </Badge>
                                <Button
                                    size="small"
                                    appearance="secondary"
                                    icon={<Delete20Regular />}
                                    onClick={() => onRemoveFile('pdf')}
                                    disabled={isLoading}
                                >
                                    إزالة
                                </Button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <input
                                    type="file"
                                    id="pdf-upload"
                                    accept=".pdf"
                                    onChange={(e) => onFileUpload('pdf', e)}
                                    style={{ display: 'none' }}
                                    disabled={isLoading}
                                />
                                <Button
                                    appearance="primary"
                                    icon={<Add20Regular />}
                                    onClick={() => document.getElementById('pdf-upload').click()}
                                    disabled={isLoading}
                                >
                                    إضافة PDF
                                </Button>
                            </div>
                        )}
                    </div>
                    
                    {/* العرض التقديمي */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '500' }}>
                            <Document20Regular style={{ marginRight: '6px' }} />
                            العرض التقديمي
                        </div>
                        
                        {additionalData.presentationFileName ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Badge appearance="filled" color="success" shape="rounded">
                                    {additionalData.presentationFileName}
                                </Badge>
                                <Button
                                    size="small"
                                    appearance="secondary"
                                    icon={<Delete20Regular />}
                                    onClick={() => onRemoveFile('presentation')}
                                    disabled={isLoading}
                                >
                                    إزالة
                                </Button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <input
                                    type="file"
                                    id="presentation-upload"
                                    accept=".ppt,.pptx,.pdf"
                                    onChange={(e) => onFileUpload('presentation', e)}
                                    style={{ display: 'none' }}
                                    disabled={isLoading}
                                />
                                <Button
                                    appearance="primary"
                                    icon={<Add20Regular />}
                                    onClick={() => document.getElementById('presentation-upload').click()}
                                    disabled={isLoading}
                                >
                                    إضافة عرض تقديمي
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* القسم 3: الطلبة والمشرف */}
            <div style={sectionStyle}>
                <div style={sectionTitleStyle}>
                    <People20Regular />
                    الطلبة والمشرف
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '14px', fontWeight: '500' }}>
                            الطلبة المسجلين: {additionalData.students.length} طالب
                        </div>
                        <Button
                            appearance="primary"
                            icon={<People20Regular />}
                            onClick={onSelectStudents}
                            disabled={isLoading}
                        >
                            تحديد الطلبة
                        </Button>
                    </div>
                    
                    {additionalData.students.length > 0 && (
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                                قائمة الطلبة
                            </div>
                            <div style={tagContainerStyle}>
                                {additionalData.students.map((student, index) => (
                                    <div key={index} style={tagStyle}>
                                        <Avatar size={20} name={student} />
                                        <span>{student}</span>
                                        <Button
                                            size="small"
                                            appearance="subtle"
                                            icon={<Delete20Regular />}
                                            onClick={() => onRemoveStudent(index)}
                                            disabled={isLoading}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* القسم 4: المراجع */}
            <div style={sectionStyle}>
                <div style={sectionTitleStyle}>
                    <Book20Regular />
                    المراجع
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '14px', fontWeight: '500' }}>
                            المراجع المحددة: {additionalData.references.length} مرجع
                        </div>
                        <Button
                            appearance="primary"
                            icon={<Book20Regular />}
                            onClick={onSelectReferences}
                            disabled={isLoading}
                        >
                            تحديد المراجع
                        </Button>
                    </div>
                    
                    {additionalData.references.length > 0 && (
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                                قائمة المراجع
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {additionalData.references.map((reference, index) => (
                                    <div key={index} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '8px 12px',
                                        backgroundColor: tokens.colorNeutralBackground2,
                                        borderRadius: '6px'
                                    }}>
                                        <span>{reference}</span>
                                        <Button
                                            size="small"
                                            appearance="subtle"
                                            icon={<Delete20Regular />}
                                            onClick={() => onRemoveReference(index)}
                                            disabled={isLoading}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* القسم 5: الفئات */}
            <div style={sectionStyle}>
                <div style={sectionTitleStyle}>
                    <Folder20Regular />
                    الفئات
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500' }}>اختر الفئات *</label>
                        <Dropdown
                            multiselect
                            value={additionalData.categories.length > 0 
                                ? `${additionalData.categories.length} فئة مختارة`
                                : "اختر الفئات"
                            }
                            selectedOptions={additionalData.categories}
                            onOptionSelect={onCategorySelect}
                            placeholder="اختر الفئات"
                            disabled={isLoading}
                        >
                            {categoryOptions.map((category) => (
                                <Option key={category.value} value={category.value}>
                                    {category.label}
                                </Option>
                            ))}
                        </Dropdown>
                    </div>
                    
                    {additionalData.categories.length > 0 && (
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                                الفئات المحددة ({additionalData.categories.length})
                            </div>
                            <div style={tagContainerStyle}>
                                {additionalData.categories.map((categoryId, index) => {
                                    const category = categoryOptions.find(c => c.value === categoryId);
                                    return (
                                        <div key={index} style={tagStyle}>
                                            <span>{category?.label || categoryId}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* القسم 6: الكلمات المفتاحية */}
            <div style={sectionStyle}>
                <div style={sectionTitleStyle}>
                    <Tag20Regular />
                    الكلمات المفتاحية
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={{ fontSize: '14px', fontWeight: '500' }}>إضافة كلمة مفتاحية</label>
                            <Input
                                placeholder="كلمة مفتاحية"
                                value={newKeyword}
                                onChange={(e) => setNewKeyword(e.target.value)}
                                disabled={isLoading}
                                onKeyUp={(e) => {
                                    if (e.key === 'Enter' && newKeyword.trim()) {
                                        onAddKeyword();
                                    }
                                }}
                            />
                        </div>
                        <Button
                            appearance="primary"
                            icon={<Add20Regular />}
                            onClick={onAddKeyword}
                            disabled={isLoading || !newKeyword.trim()}
                        >
                            إضافة
                        </Button>
                    </div>
                    
                    {additionalData.keywords.length > 0 && (
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                                الكلمات المفتاحية ({additionalData.keywords.length})
                            </div>
                            <div style={tagContainerStyle}>
                                {additionalData.keywords.map((keyword, index) => (
                                    <Tag
                                        key={index}
                                        appearance="brand"
                                        shape="rounded"
                                        dismissible
                                        onDismiss={() => onRemoveKeyword(index)}
                                        disabled={isLoading}
                                    >
                                        {keyword}
                                    </Tag>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {error && (
                <div style={{ marginTop: '8px', textAlign: 'center', color: '#ef4444', whiteSpace: 'pre-line' }}>
                    {error}
                </div>
            )}
            
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                * الحقول المميزة بعلامة النجمة إلزامية
            </div>
        </div>
    );
}