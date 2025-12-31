import { Button, Divider, Spinner, tokens } from "@fluentui/react-components";
import ControlArea, { FileItem } from "./ControlArea";
import { ArrowClockwise20Regular, FolderArrowUp20Regular, CheckmarkCircle20Filled } from "@fluentui/react-icons";
import React, { useState, useEffect, useCallback } from "react";
import { deleteFile, getFiles } from "@root/src/services/files";
import { useDispatch, useSelector } from "react-redux";
import { setControlDialog } from "@root/src/store/slices/controlDialog.slice";
import UploadFileDialog from "../Dialogs/UploadFileDialog";
import Loading from "@PreMadeComponents/Loading";

export default function Files() {
    const dispatch = useDispatch();
    
    const [files, setFiles] = useState([]);
    const [existingFileId, setExistingFileId] = useState(null); //  تغيير الاسم
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const controlDialog = useSelector(state => state.controlDialog.value);

    const fetchFiles = useCallback(() => {
        setIsLoading(true);
        getFiles()
            .then(res => {
                setFiles(res.data?.result || []);
            })
            .catch(err => {
                console.error('Error fetching files:', err);
                alert('فشل تحميل الملفات. يرجى المحاولة مرة أخرى');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    //  إضافة useEffect لإزالة التمييز بعد فترة
    useEffect(() => {
        if (existingFileId) {
            const timer = setTimeout(() => {
                setExistingFileId(null);
            }, 5000); // إزالة التمييز بعد 5 ثواني
            return () => clearTimeout(timer);
        }
    }, [existingFileId]);

    const handleDelete = useCallback((file) => {
        return async () => {
            if (!window.confirm(`هل أنت متأكد من حذف الملف \n"${file.stored_name}"؟`)) {
                return;
            }

            setIsDeleting(file.file_id);
            try {
                const res = await deleteFile(file.file_id);
                if (res.data?.success) {
                    alert(`تم حذف \n${file.stored_name}`);
                    fetchFiles(); // تحديث القائمة بعد الحذف
                }
            } catch (err) {
                console.error('Error deleting file:', err);
                alert('فشل حذف الملف، حاول مرة أخرى');
            } finally {
                setIsDeleting(false);
            }
        };
    }, [fetchFiles]);

    const handleRefresh = useCallback(() => {
        fetchFiles();
        setExistingFileId(null);
    }, [fetchFiles]);

    //  تحسين دالة التعامل مع الملف الموجود
    const handleFileExists = useCallback((file) => {
        if (file && file.file_id) {
            setExistingFileId(file.file_id);
            
            const element = document.querySelector(`[data-file-id="${file.file_id}"]`);

            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            fetchFiles();
        }
    }, [fetchFiles]);

    const renderDataContainer = useCallback(() => {
        if (isLoading) {
            return (
                <div style={{ padding: '40px', textAlign: 'center' }}>
                    <Loading size="large" full vertical text='جار تحميل الملفات...' />
                </div>
            );
        }

        if (files.length === 0) {
            return (
                <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                    لا توجد ملفات لعرضها
                </div>
            );
        }

        return (
            <div style={{ padding: '13px' }}>
                {files.map((file, index) => {
                    const fileSizeMB = file.size ? (file.size / (1024 * 1024)).toFixed(2) : '0.00';
                    const updateDate = file.updatedAt || file.updated_at || file.createdAt || file.created_at;
                    const formattedDate = updateDate ? new Date(updateDate).toISOString().slice(0, 10) : 'غير محدد';
                    
                    //  تحسين تحديد الملف الموجود
                    const isExistingFile = existingFileId === file.file_id;
                    
                    return (
                        <div 
                            key={file.file_id || index}
                            data-file-id={file.file_id}
                            style={{
                                transition: 'all 0.3s ease',
                                marginBottom: index < files.length - 1 ? '10px' : '0'
                            }}
                        >
                            <FileItem 
                                filename={file.stored_name || 'بدون اسم'}
                                type={file.mime_type || 'غير معروف'}
                                category={file.category || 'غير مصنف'}
                                size={`${fileSizeMB} MB`}
                                lastUpdate={formattedDate}
                                style={{
                                    border: isExistingFile ? `2px solid ${tokens.colorPaletteGreenBorderActive}` : undefined,
                                    backgroundColor: isExistingFile ? tokens.colorPaletteGreenBackground1 : undefined,
                                    boxShadow: isExistingFile ? `0 0 0 1px ${tokens.colorPaletteGreenBorderActive}` : undefined,
                                    position: 'relative'
                                }}
                                actions={[
                                    {
                                        content: isDeleting && isDeleting === file.file_id ? (
                                            <>
                                                <Spinner size="tiny" style={{ marginLeft: '4px' }} />
                                                جاري الحذف...
                                            </>
                                        ) : 'حذف',
                                        onClick: handleDelete(file),
                                        disabled: isDeleting,
                                        className: 'delete'
                                    },
                                ]}
                            />
                            {index < files.length - 1 && <Divider style={{ margin: '5px 0' }} />}
                        </div>
                    );
                })}
            </div>
        );
    }, [files, isLoading, isDeleting, existingFileId, handleDelete]);

    return (
        <ControlArea
            title="الملفات"
            toolbar={[
                (<Button
                    key="upload"
                    icon={<FolderArrowUp20Regular />}
                    onClick={() => dispatch(setControlDialog('uploadFile'))}
                    appearance="primary"
                >
                    رفع ملف
                </Button>),
                (<Button
                    key="refresh"
                    icon={<ArrowClockwise20Regular />}
                    appearance="secondary"
                    onClick={handleRefresh}
                    disabled={isLoading || isDeleting}
                >
                    تحديث
                </Button>),
            ]}
            dataContainer={renderDataContainer()}
            footer={
                <>
                    {controlDialog === 'uploadFile' && (
                        <UploadFileDialog onFileExists={handleFileExists} />
                    )}
                </>
            }
        />
    );
}