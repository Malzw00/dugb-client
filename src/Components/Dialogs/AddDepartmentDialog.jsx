import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dialog from "./AbstractDialog";
import { clearControlDialog } from "@root/src/store/slices/controlDialogs.slice";
import { Button, Input } from "@fluentui/react-components";
import { addDepartment } from "@root/src/services/collage";
import Loading from "@PreMadeComponents/Loading";
import { setDepartments } from "@root/src/store/slices/departments.slice";

export default function AddDepartmentDialog({ selectedCollage }) {
    
    const dispatch = useDispatch();
    
    const departments = useSelector(state => state.departments?.value || []);
    
    const [departmentName, setDepartmentName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const validateDepartmentName = useCallback((name) => {
        const trimmedName = name.trim();

        if (!trimmedName) {
            setError("اسم القسم لا يمكن أن يكون فارغًا");
            return false;
        }

        const departmentNameRegex = /^[A-Za-z\u0600-\u06FF][A-Za-z\u0600-\u06FF\s-]{2,}$/;

        if (!departmentNameRegex.test(trimmedName)) {
            setError(
                "اسم القسم غير صالح.\n" +
                "يجب أن يبدأ بحرف، ويحتوي فقط على حروف ومسافات أو (-)"
            );
            return false;
        }

        setError('');
        return true;
    }, []);

    const handleDone = useCallback(async () => {
        if (!selectedCollage || !selectedCollage.collage_id) {
            setError("لم يتم تحديد كلية لإضافة القسم إليها");
            return;
        }

        if (!validateDepartmentName(departmentName)) {
            return;
        }

        setIsLoading(true);
        try {
            const res = await addDepartment(selectedCollage.collage_id, { 
                name: departmentName.trim()
            });
            
            if (res.data?.success) {
                alert(`تم إنشاء قسم بإسم "${res.data?.result?.department_name || departmentName}"`);                
                setDepartmentName('');
                setError('');
            } else {
                setError('فشل إنشاء القسم. قد يكون الاسم مكرر، يرجى المحاولة مرة أخرى');
            }
        } catch (err) {
            console.error('Error creating department:', err);
            setError('فشل إنشاء القسم. قد يكون الاسم مكرر، يرجى المحاولة مرة أخرى');
        } finally {
            setIsLoading(false);
        }
    }, [departmentName, selectedCollage, departments, dispatch, validateDepartmentName]);

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

    const handleInputChange = useCallback((e) => {
        setDepartmentName(e.target.value);
        // مسح الخطأ عند بدء الكتابة
        if (error) {
            setError('');
        }
    }, [error]);

    // إذا لم تكن هناك كلية محددة، عرض رسالة خطأ
    if (!selectedCollage) {
        return (
            <Dialog
                style={{ width: '40%' }}
                title={'إضافة قسم'}
                body={
                    <div style={{ padding: '16px 0', textAlign: 'center', color: 'red' }}>
                        لم يتم تحديد كلية لإضافة القسم إليها
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
            style={{ width: '40%' }}
            title={`إضافة قسم جديد - ${selectedCollage.collage_name}`}
            body={
                <DialogBody 
                    departmentName={departmentName}
                    error={error}
                    isLoading={isLoading}
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
                        disabled={isLoading || !departmentName.trim()}
                        icon={isLoading ? <Loading size="tiny" /> : undefined}
                    >
                        {isLoading ? 'جاري الإضافة...' : 'إضافة'}
                    </Button>
                </div>
            }
        />
    );
}

function DialogBody({ departmentName, error, isLoading, onInputChange, onKeyUp, collageName }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '13px' }}>
            <div style={{ textAlign: 'center' }}>أدخل اسم القسم الجديد</div>
            
            {collageName && (
                <div style={{ 
                    padding: '8px 13px', 
                    border: '1px solid silver', 
                    borderRadius: '5px', 
                    backgroundColor: '#f3f2f1'
                }}>
                    الكلية المحددة: <span style={{ fontWeight: 'bold' }}>{collageName}</span>
                </div>
            )}
            
            <Input
                placeholder="اسم القسم"
                value={departmentName}
                onChange={onInputChange}
                onKeyUp={onKeyUp}
                disabled={isLoading}
            />
            {error && (
                <div style={{ 
                    marginTop: '8px', 
                    textAlign: 'center', 
                    color: 'red',
                    whiteSpace: 'pre-line'
                }}>
                    {error}
                </div>
            )}
            {isLoading && (
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '8px',
                    marginTop: '8px'
                }}>
                    <span>جاري إنشاء القسم...</span>
                </div>
            )}
        </div>
    );
}