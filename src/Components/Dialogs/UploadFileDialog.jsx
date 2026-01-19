import React, { useState, useCallback, useEffect } from "react";
import { Button, Dropdown, Input, Option, Spinner, ProgressBar, tokens } from "@fluentui/react-components";
import Dialog from "./AbstractDialog";
import { useDispatch } from "react-redux";
import { setControlDialog } from "@root/src/store/slices/controlDialog.slice";
import { uploadFile } from "@root/src/services/files";
import Loading from "@PreMadeComponents/Loading";

export default function UploadFileDialog({ onFileExists }) {
    const dispatch = useDispatch();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const handleClose = useCallback(() => {
        if (!isLoading) {
            dispatch(setControlDialog(null));
        }
    }, [dispatch, isLoading]);

    return (
        <Dialog
            style={{ width: '600px' }}
            title={`رفع ملف جديد`}
            body={
                <UploadFileDialogBody 
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    onCancel={handleClose}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    onFileExists={onFileExists}
                />
            }
            onCloseBtnClick={handleClose}
        />
    );
}

export function UploadFileDialogBody({ onFileExists, selectedCategory, setSelectedCategory, onCancel, isLoading, setIsLoading }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileError, setFileError] = useState('');
    const [categoryError, setCategoryError] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [autoDetectedCategory, setAutoDetectedCategory] = useState(null);
    
    const categoryOptions = [
        { value: 'book', label: 'كتاب' },
        { value: 'presentation', label: 'عرض تقديمي' },
        { value: 'image', label: 'صورة' },
        { value: 'reference', label: 'مرجع' }
    ];

    // قائمة أنواع الملفات المسموحة - مزامنة مع الباك إند
    const allowedMimeTypes = [
        // صور
        "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",
        // مستندات
        "application/pdf", 
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        // عروض
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        // جداول
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        // أرشيف
        "application/zip", "application/x-rar-compressed", "application/x-7z-compressed",
        // نصوص
        "text/plain", "text/html", "text/css", "application/json"
    ];

    const allowedExtensions = [
        // صور
        ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg",
        // مستندات
        ".pdf", ".doc", ".docx",
        // عروض
        ".ppt", ".pptx",
        // جداول
        ".xls", ".xlsx",
        // أرشيف
        ".zip", ".rar", ".7z",
        // نصوص
        ".txt", ".html", ".htm", ".css", ".json"
    ];

    // دالة لتحديد التصنيف تلقائياً بناءً على نوع الملف
    const detectCategoryFromFileType = useCallback((fileType) => {
        const type = fileType.toLowerCase();
        
        if (type.includes('presentation') || 
            type.includes('powerpoint') ||
            type.includes('pptx') ||
            type.includes('ppt')) {
            return 'presentation';
        }
        
        if (type.includes('image') || 
            type.includes('jpeg') || 
            type.includes('png') || 
            type.includes('gif') || 
            type.includes('webp') ||
            type.includes('svg')) {
            return 'image';
        }
        
        if (type.includes('pdf') || 
            type.includes('msword') || 
            type.includes('word') ||
            type.includes('document')) {
            return 'book';
        }
        
        if (type.includes('zip') || 
            type.includes('rar') || 
            type.includes('7z') ||
            type.includes('text') || 
            type.includes('plain') ||
            type.includes('html') ||
            type.includes('css') ||
            type.includes('json') ||
            type.includes('excel') || 
            type.includes('spreadsheet') ||
            type.includes('xls') ||
            type.includes('xlsx')) {
            return 'reference';
        }
        
        return null;
    }, []);

    // دالة لتبسيط اسم نوع الملف
    const simplifyMimeType = useCallback((mimeType) => {
        const typeMap = {
            // صور
            'image/jpeg': 'JPG',
            'image/png': 'PNG',
            'image/gif': 'GIF',
            'image/webp': 'WEBP',
            'image/svg+xml': 'SVG',
            
            // مستندات
            'application/pdf': 'PDF',
            'application/msword': 'DOC',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
            
            // عروض
            'application/vnd.ms-powerpoint': 'PPT',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
            
            // جداول
            'application/vnd.ms-excel': 'XLS',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
            
            // أرشيف
            'application/zip': 'ZIP',
            'application/x-rar-compressed': 'RAR',
            'application/x-7z-compressed': '7Z',
            
            // نصوص
            'text/plain': 'TXT',
            'text/html': 'HTML',
            'text/css': 'CSS',
            'application/json': 'JSON'
        };
        
        return typeMap[mimeType] || mimeType.split('/').pop().toUpperCase();
    }, []);

    // دالة للحصول على أسماء الأنواع المسموحة لعرضها للمستخدم
    const getAllowedFileTypesText = useCallback(() => {
        const groups = {
            'صور': ['JPG', 'PNG', 'GIF', 'WEBP', 'SVG'],
            'مستندات': ['PDF', 'DOC', 'DOCX'],
            'عروض تقديمية': ['PPT', 'PPTX'],
            'جداول': ['XLS', 'XLSX'],
            'أرشيف': ['ZIP', 'RAR', '7Z'],
            'نصوص': ['TXT', 'HTML', 'CSS', 'JSON']
        };
        
        return Object.entries(groups)
            .map(([category, types]) => `${category}: ${types.join(', ')}`)
            .join(' | ');
    }, []);

    const validateForm = useCallback(() => {
        let isValid = true;
        
        if (!selectedFile) {
            setFileError('يجب اختيار ملف للرفع');
            isValid = false;
        } else {
            setFileError('');
        }

        // التحقق من حجم الملف (100MB كحد أقصى)
        if (selectedFile && selectedFile.size > 100 * 1024 * 1024) {
            setFileError('حجم الملف كبير جداً. الحد الأقصى 100MB');
            isValid = false;
        }

        if (selectedFile) {
            if (!allowedMimeTypes.includes(selectedFile.type)) {
                setFileError(`نوع الملف غير مسموح به. الأنواع المسموحة:\n${getAllowedFileTypesText()}`);
                isValid = false;
            }
        }

        if (!selectedCategory) {
            setCategoryError('يجب اختيار تصنيف للملف');
            isValid = false;
        } else if (selectedCategory && !categoryOptions.map(opt => opt.value).includes(selectedCategory)) {
            setCategoryError('تصنيف الملف غير صالح');
            isValid = false;
        } else {
            setCategoryError('');
        }

        return isValid;
    }, [selectedFile, selectedCategory, categoryOptions, getAllowedFileTypesText]);

    const handleFileChange = useCallback((event) => {
        const file = event.target.files[0];
        if (file) {
            // التحقق من نوع الملف
            if (!allowedMimeTypes.includes(file.type)) {
                setFileError(`نوع الملف غير مسموح به. الأنواع المسموحة:\n${getAllowedFileTypesText()}`);
                return;
            }
            
            setSelectedFile(file);
            setFileError('');
            
            // تحديد التصنيف تلقائياً
            const detectedCategory = detectCategoryFromFileType(file.type);
            if (detectedCategory) {
                setAutoDetectedCategory(detectedCategory);
                setSelectedCategory(detectedCategory);
                setCategoryError('');
            } else {
                setAutoDetectedCategory(null);
                setCategoryError('لم يتم التعرف على التصنيف تلقائياً، يرجى اختيار تصنيف');
            }
        }
    }, [detectCategoryFromFileType, getAllowedFileTypesText]);

    const handleUpload = useCallback(async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setIsUploading(true);
        setUploadProgress(0);
        
        const handleProgress = (percent) => {
            setUploadProgress(percent);
        };
        
        try {
            const response = await uploadFile(
                selectedFile,
                selectedCategory,
                handleProgress
            );
            
            if (response.data?.success) {
                
                if (response.data.result?.message === 'File already exists') {
                    const existingFile = response.data.result?.file;
                    
                    // نافذة منبثقة أكثر وضوحاً مع خيارات
                    const userChoice = window.confirm(
                        ` الملف "${selectedFile.name}" موجود بالفعل في النظام.\n\n` +
                        `الملف الموجود: ${existingFile?.stored_name || 'غير معروف'}\n` +
                        `التصنيف: ${categoryOptions.find(cat => cat.value === existingFile?.category)?.label || 'غير معروف'}\n\n` +
                        `هل تريد الانتقال إلى الملف الموجود؟`
                    );
                    
                    if (userChoice && onFileExists) {
                        onFileExists(existingFile);
                    }

                    setFileError('الملف موجود بالفعل في النظام');
                    return;
                }
                
                alert(` تم رفع الملف "${selectedFile.name}" بنجاح`);
                resetForm();
                
                setTimeout(() => {
                    onCancel();
                }, 1500);
            } else {
                const errorMessage = response.data?.message || 'فشل رفع الملف. يرجى المحاولة مرة أخرى';
                setFileError(errorMessage);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            
            // تحسين رسائل الخطأ
            let errorMessage = 'حدث خطأ أثناء رفع الملف';
            
            if (error.response) {
                // معالجة الأخطاء المحددة من الخادم
                const serverError = error.response.data;
                
                if (serverError?.message?.includes('already exists')) {
                    errorMessage = 'الملف موجود بالفعل في النظام';
                } else if (serverError?.message) {
                    errorMessage = serverError.message;
                } else if (error.response.status === 413) {
                    errorMessage = 'حجم الملف كبير جداً';
                } else {
                    errorMessage = `خطأ في الخادم: ${error.response.status}`;
                }
            } else if (error.request) {
                errorMessage = 'لا يمكن الاتصال بالخادم. تحقق من اتصال الشبكة';
            } else {
                errorMessage = error.message || 'خطأ في إعداد الطلب';
            }
            
            setFileError(errorMessage);
        } finally {
            setIsLoading(false);
            setIsUploading(false);
            setUploadProgress(0);
        }
    }, [validateForm, selectedFile, selectedCategory, onFileExists, onCancel, categoryOptions]);

    // دالة لإعادة تعيين النموذج
    const resetForm = () => {
        setSelectedFile(null);
        setSelectedCategory(null);
        setAutoDetectedCategory(null);
        setUploadProgress(0);
        setFileError('');
        setCategoryError('');
        const fileInput = document.getElementById('file-input');
        if (fileInput) fileInput.value = '';
    };

    const handleCancel = useCallback(() => {
        if (!isLoading && !isUploading) {
            onCancel();
        }
    }, [isLoading, isUploading, onCancel]);

    // دالة لتنسيق حجم الملف
    const formatFileSize = useCallback((bytes) => {
        if (!bytes || bytes === 0) return '0 بايت';
        const k = 1024;
        const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }, []);

    // الحصول على اسم نوع الملف المختصر
    const getSimplifiedFileType = useCallback((mimeType) => {
        return simplifyMimeType(mimeType);
    }, [simplifyMimeType]);

    // الحصول على اسم التصنيف
    const getCategoryLabel = useCallback((categoryValue) => {
        const category = categoryOptions.find(cat => cat.value === categoryValue);
        return category ? category.label : 'غير محدد';
    }, [categoryOptions]);

    // عند تغيير التصنيف يدوياً
    const handleCategoryChange = useCallback((_, data) => {
        if (data.selectedOptions[0]) {
            setSelectedCategory(data.selectedOptions[0]);
            setCategoryError(''); // مسح خطأ التصنيف
            setAutoDetectedCategory(null); // إزالة التحديد التلقائي عند التغيير اليدوي
        }
    }, []);

    // Render category display with color
    const renderCategoryDisplay = useCallback(() => {
        if (!selectedCategory) return null;
        
        // تحديد لون التصنيف: أخضر إذا كان تلقائياً، أزرق إذا كان يدوياً
        const categoryColor = autoDetectedCategory ? 
            tokens.colorPaletteGreenForeground2 : 
            tokens.colorBrandBackground;
        
        const categoryBgColor = autoDetectedCategory ? 
            tokens.colorPaletteGreenBackground2 : 
            tokens.colorNeutralBackground2;
        
        const categoryBorderColor = autoDetectedCategory ? 
            tokens.colorPaletteGreenBorderActive : 
            tokens.colorNeutralStroke1;
        
        return (
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '5px',
                marginBottom: '10px'
            }}>
                <label style={{ fontSize: '14px', fontWeight: '500' }}>التصنيف المحدد *</label>
                <div style={{ 
                    padding: '8px 12px',
                    backgroundColor: categoryBgColor,
                    borderRadius: '4px',
                    border: `2px solid ${categoryBorderColor}`,
                    fontSize: '14px',
                    color: categoryColor,
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease'
                }}>
                    <div style={{ 
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: categoryColor
                    }} />
                    <span>{getCategoryLabel(selectedCategory)}</span>
                    {autoDetectedCategory ? (
                        <span style={{ 
                            fontSize: '11px',
                            color: tokens.colorPaletteGreenForeground1,
                            marginRight: 'auto',
                            fontStyle: 'italic',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            <span style={{ 
                                fontSize: '16px',
                                color: tokens.colorPaletteGreenForeground1
                            }}>✓</span>
                            تم التحديد تلقائياً
                        </span>
                    ) : (
                        <span style={{ 
                            fontSize: '11px',
                            color: tokens.colorNeutralForeground3,
                            marginRight: 'auto',
                            fontStyle: 'italic'
                        }}>
                            (تم التحديد يدوياً)
                        </span>
                    )}
                </div>
            </div>
        );
    }, [selectedCategory, autoDetectedCategory, getCategoryLabel, tokens]);

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '13px',
            padding: '8px 0'
        }}>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                ارفع ملفاً جديداً إلى النظام
            </div>
            
            {/* حقل عرض التصنيف المحدد */}
            {renderCategoryDisplay()}
            
            {/* حقل اختيار التصنيف */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500' }}>
                    {autoDetectedCategory ? 'تغيير التصنيف' : 'اختر تصنيف الملف *'}
                </label>
                <Dropdown 
                    placeholder="اختر تصنيفاً"
                    selectedOptions={selectedCategory ? [selectedCategory] : []}
                    onOptionSelect={handleCategoryChange}
                    disabled={isLoading || isUploading}
                    style={{
                        borderColor: autoDetectedCategory ? tokens.colorPaletteGreenBorderActive : undefined,
                        '&:focus': {
                            borderColor: autoDetectedCategory ? tokens.colorPaletteGreenBorderActive : undefined
                        }
                    }}
                >
                    {categoryOptions.map((option) => (
                        <Option key={option.value} value={option.value}>
                            {option.label}
                        </Option>
                    ))}
                </Dropdown>
                {categoryError && (
                    <div style={{ 
                        fontSize: '12px',
                        color: tokens.colorPaletteRedForeground1,
                        padding: '4px 8px',
                        backgroundColor: tokens.colorPaletteRedBackground2,
                        borderRadius: '4px',
                        marginTop: '2px'
                    }}>
                         {categoryError}
                    </div>
                )}
                {autoDetectedCategory && !categoryError && (
                    <div style={{ 
                        fontSize: '12px',
                        color: tokens.colorPaletteGreenForeground2,
                        padding: '4px 8px',
                        backgroundColor: tokens.colorPaletteGreenBackground2,
                        borderRadius: '4px',
                        marginTop: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}>
                        <span style={{ 
                            fontSize: '16px',
                            color: tokens.colorPaletteGreenForeground2
                        }}>✓</span>
                        تم تحديد التصنيف "{getCategoryLabel(autoDetectedCategory)}" تلقائياً حسب نوع الملف
                    </div>
                )}
            </div>
            
            {/* حقل اختيار الملف */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500' }}>اختر الملف *</label>
                <div 
                    style={{ 
                        border: '2px dashed #ddd',
                        borderRadius: '6px',
                        padding: '16px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: tokens.colorNeutralBackground2,
                        transition: 'all 0.3s',
                        opacity: (isLoading || isUploading) ? 0.6 : 1
                    }} 
                    onClick={() => !isLoading && !isUploading && document.getElementById('file-input').click()}
                    onDragOver={(e) => {
                        if (isLoading || isUploading) return;
                        e.preventDefault();
                        e.currentTarget.style.borderColor = tokens.colorBrandBackground;
                        e.currentTarget.style.backgroundColor = tokens.colorBrandBackground2;
                    }}
                    onDragLeave={(e) => {
                        e.currentTarget.style.borderColor = '#ddd';
                        e.currentTarget.style.backgroundColor = tokens.colorNeutralBackground2;
                    }}
                    onDrop={(e) => {
                        if (isLoading || isUploading) return;
                        e.preventDefault();
                        const files = e.dataTransfer.files;
                        if (files.length > 0) {
                            const file = files[0];
                            
                            // التحقق من نوع الملف فوراً
                            if (!allowedMimeTypes.includes(file.type)) {
                                setFileError(`نوع الملف غير مسموح به. الأنواع المسموحة:\n${getAllowedFileTypesText()}`);
                                return;
                            }
                            
                            // التحقق من حجم الملف (100MB كحد أقصى)
                            if (file.size > 100 * 1024 * 1024) {
                                setFileError('حجم الملف كبير جداً. الحد الأقصى 100MB');
                                return;
                            }
                            
                            setSelectedFile(file);
                            setFileError('');
                            
                            // تحديد التصنيف تلقائياً
                            const detectedCategory = detectCategoryFromFileType(file.type);
                            if (detectedCategory) {
                                setAutoDetectedCategory(detectedCategory);
                                setSelectedCategory(detectedCategory);
                                setCategoryError('');
                            } else {
                                setAutoDetectedCategory(null);
                                setCategoryError('لم يتم التعرف على التصنيف تلقائياً، يرجى اختيار تصنيف');
                            }
                        }
                        e.currentTarget.style.borderColor = '#ddd';
                        e.currentTarget.style.backgroundColor = tokens.colorNeutralBackground2;
                    }}
                >
                    {selectedFile ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{selectedFile.name}</div>
                            <div style={{ fontSize: '12px', color: tokens.colorNeutralForeground3 }}>
                                حجم الملف: {formatFileSize(selectedFile.size)}
                            </div>
                            <div style={{ fontSize: '12px', color: tokens.colorNeutralForeground3 }}>
                                نوع الملف: {getSimplifiedFileType(selectedFile.type)}
                            </div>
                            <Button 
                                size="small" 
                                appearance="secondary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedFile(null);
                                    setAutoDetectedCategory(null);
                                    setSelectedCategory(null);
                                    setCategoryError('');
                                    document.getElementById('file-input').value = '';
                                }}
                                disabled={isLoading || isUploading}
                                style={{ marginTop: '8px' }}
                            >
                                تغيير الملف
                            </Button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <div>اسحب وأفلت الملف هنا أو انقر للاختيار</div>
                            <div style={{ fontSize: '12px', color: tokens.colorNeutralForeground3 }}>
                                {/* تحديث: عرض أنواع الملفات المسموحة بشكل منظم */}
                                {getAllowedFileTypesText()}
                            </div>
                            <div style={{ fontSize: '12px', color: tokens.colorNeutralForeground3 }}>
                                الحد الأقصى: 100MB
                            </div>
                        </div>
                    )}
                </div>
                {fileError && (
                    <div style={{ 
                        fontSize: '12px',
                        color: tokens.colorPaletteRedForeground1,
                        padding: '4px 8px',
                        backgroundColor: tokens.colorPaletteRedBackground2,
                        borderRadius: '4px',
                        marginTop: '2px',
                        whiteSpace: 'pre-line'
                    }}>
                         {fileError}
                    </div>
                )}
                <input 
                    id="file-input"
                    type="file"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    disabled={isLoading || isUploading}
                    // تحديث: إضافة جميع الامتدادات المسموحة
                    accept={allowedExtensions.join(',')}
                />
            </div>
            
            {/* شريط تقدم الرفع */}
            {isUploading && (
                <div style={{ marginTop: '8px' }}>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        marginBottom: '4px',
                        fontSize: '14px'
                    }}>
                        <span>جاري رفع الملف...</span>
                        <span>{uploadProgress}%</span>
                    </div>
                    <ProgressBar 
                        value={uploadProgress} 
                        max={100}
                        thickness="large"
                    />
                </div>
            )}
            
            {/* معلومات الملف المحدد */}
            {selectedFile && !isUploading && (
                <div style={{ 
                    padding: '12px',
                    backgroundColor: tokens.colorBrandBackground2,
                    borderRadius: '4px',
                    fontSize: '13px',
                    border: `1px solid ${tokens.colorBrandStroke1}`
                }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', textAlign: 'center' }}>
                        معلومات الملف المحدد
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>اسم الملف:</span>
                            <span style={{ fontWeight: '500' }}>{selectedFile.name}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>حجم الملف:</span>
                            <span style={{ fontWeight: '500' }}>{formatFileSize(selectedFile.size)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>النوع:</span>
                            <span style={{ fontWeight: '500' }}>
                                {getSimplifiedFileType(selectedFile.type)}
                            </span>
                        </div>
                        {selectedCategory && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>التصنيف:</span>
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '6px',
                                    color: autoDetectedCategory ? 
                                        tokens.colorPaletteGreenForeground2 : 
                                        tokens.colorBrandBackground,
                                    fontWeight: '600'
                                }}>
                                    <div style={{ 
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        backgroundColor: autoDetectedCategory ? 
                                            tokens.colorPaletteGreenForeground2 : 
                                            tokens.colorBrandBackground
                                    }} />
                                    <span>{getCategoryLabel(selectedCategory)}</span>
                                    {autoDetectedCategory && (
                                        <span style={{ 
                                            fontSize: '10px',
                                            color: tokens.colorPaletteGreenForeground1,
                                            fontStyle: 'italic',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '2px'
                                        }}>
                                            <span>✓</span>
                                            تلقائي
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {/* أزرار الإجراءات */}
            <div style={{ 
                display: 'flex', 
                flexDirection: 'row', 
                justifyContent: 'flex-end', 
                gap: '8px',
                marginTop: '8px'
            }}>
                <Button 
                    appearance="secondary" 
                    onClick={handleCancel}
                    disabled={isLoading || isUploading}
                >
                    إلغاء
                </Button>
                <Button 
                    appearance="primary" 
                    onClick={handleUpload}
                    disabled={isLoading || isUploading || !selectedFile || !selectedCategory}
                    icon={isUploading ? <Loading size="tiny" /> : undefined}
                >
                    {isUploading ? 'جاري الرفع...' : 'رفع الملف'}
                </Button>
            </div>
            
            {/* ملاحظات */}
            <div style={{ 
                fontSize: '12px', 
                color: tokens.colorNeutralForeground3,
                textAlign: 'center',
                marginTop: '8px',
                paddingTop: '8px',
                borderTop: `1px solid ${tokens.colorNeutralStroke2}`
            }}>
                * يجب اختيار ملف للرفع<br />
                * يجب اختيار تصنيف للملف<br />
                *** الحد الأقصى لحجم الملف: 100MB
            </div>
        </div>
    );
}