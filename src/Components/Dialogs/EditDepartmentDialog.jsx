import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import Dialog from "./AbstractDialog";
import { clearControlDialog } from "@root/src/store/slices/controlDialog.slice";
import { Button, Input, Dropdown, Option } from "@fluentui/react-components";
import { updateDepartment } from "@root/src/services/collage";
import Loading from "@PreMadeComponents/Loading";

export default function EditDepartmentDialog({ currentDepartment, collages, selectedCollage }) {
    
    const dispatch = useDispatch();
    
    const [departmentName, setDepartmentName] = useState('');
    const [_selectedCollage, selectCollage] = useState(selectedCollage || null);
    const [originalCollageId, setOriginalCollageId] = useState(null);
    const [originalDepartmentName, setOriginalDepartmentName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // تهيئة البيانات عند تغيير currentDepartment
    useEffect(() => {
        if (currentDepartment) {
            setDepartmentName(currentDepartment.department_name || '');
            setOriginalDepartmentName(currentDepartment.department_name || '');
            setOriginalCollageId(currentDepartment.collage_id);
            
            // البحث عن الكلية الحالية في قائمة الكليات
            const currentCollage = collages?.find(c => c.collage_id === currentDepartment.collage_id);
            if (currentCollage) {
                selectCollage(currentCollage);
            }
        }
    }, [currentDepartment, collages]);

    const validateDepartmentName = useCallback((name) => {
        const trimmedName = name.trim();

        if (!trimmedName) {
            setError("اسم القسم لا يمكن أن يكون فارغًا");
            return false;
        }

        // التحقق إذا لم يتغير شيء
        const isNameSame = trimmedName === originalDepartmentName;
        const isCollageSame = !_selectedCollage || _selectedCollage.collage_id === originalCollageId;
        
        if (isNameSame && isCollageSame) {
            setError("لم تقم بإجراء أي تغييرات");
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
    }, [originalDepartmentName, originalCollageId, _selectedCollage]);

    const handleUpdate = useCallback(async () => {
        if (!currentDepartment || !currentDepartment.department_id) {
            setError("لم يتم تحديد قسم للتعديل");
            return;
        }

        if (!_selectedCollage || !_selectedCollage.collage_id) {
            setError("يجب تحديد كلية");
            return;
        }

        // التحقق إذا تم تغيير الكلية وطلب التأكيد
        const isCollageChanged = _selectedCollage.collage_id !== originalCollageId;
        if (isCollageChanged) {
            const confirmMessage = `هل أنت متأكد من نقل القسم "${originalDepartmentName}" من الكلية الحالية إلى "${_selectedCollage.collage_name}"؟`;
            if (!window.confirm(confirmMessage)) {
                return;
            }
        }

        if (!validateDepartmentName(departmentName)) {
            return;
        }

        setIsLoading(true);
        try {
            const res = await updateDepartment({ 
                collageId: _selectedCollage.collage_id,
                departmentId: currentDepartment.department_id,
                name: departmentName.trim(),
            });
            
            if (res.data?.success) {
                alert(`تم تعديل القسم "${originalDepartmentName}" إلى "${departmentName.trim()}"`);
                dispatch(clearControlDialog()); // إغلاق النافذة بعد النجاح
            }
        } catch (err) {
            console.error('Error updating department:', err);
            setError(err.response.data?.message || 'فشل تعديل القسم. يرجى المحاولة مرة أخرى');
        } finally {
            setIsLoading(false);
        }
    }, [departmentName, currentDepartment, _selectedCollage, dispatch, validateDepartmentName, originalDepartmentName, originalCollageId]);

    const handleClose = useCallback(() => {
        if (!isLoading) {
            dispatch(clearControlDialog());
        }
    }, [dispatch, isLoading]);

    const handleKeyUp = useCallback((e) => {
        if (e.key === 'Enter' && !isLoading) {
            handleUpdate();
        }
    }, [handleUpdate, isLoading]);

    const handleInputChange = useCallback((e) => {
        setDepartmentName(e.target.value);
        // مسح الخطأ عند بدء الكتابة
        if (error) {
            setError('');
        }
    }, [error]);

    const handleCollageChange = useCallback((_, data) => {
        if (data.selectedOptions && data.selectedOptions[0]) {
            const selectedId = data.selectedOptions[0];
            const foundCollage = collages.find(c => c.collage_id === selectedId);
            
            if (foundCollage) {
                selectCollage(foundCollage);
            }
        }
    }, [collages]);

    // إذا لم يكن هناك قسم محدد، عرض رسالة خطأ
    if (!currentDepartment) {
        return (
            <Dialog
                style={{ width: '40%' }}
                title={'تعديل قسم'}
                body={
                    <div className="py-4 text-center text-red-500">
                        لم يتم تحديد قسم للتعديل
                    </div>
                }
                onCloseBtnClick={handleClose}
                footer={
                    <div className='flex-row justify-end gap-5px'>
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

    // إذا لم توجد كليات، عرض رسالة خطأ
    if (!collages || collages.length === 0) {
        return (
            <Dialog
                style={{ width: '40%' }}
                title={`تعديل قسم: ${originalDepartmentName}`}
                body={
                    <div className="py-4 text-center text-red-500">
                        لا توجد كليات متاحة
                    </div>
                }
                onCloseBtnClick={handleClose}
                footer={
                    <div className='flex-row justify-end gap-5px'>
                        <Button 
                            appearance="secondary" 
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            إلغاء
                        </Button>
                        <Button 
                            appearance="primary" 
                            onClick={handleUpdate}
                            disabled={true}
                        >
                            تعديل
                        </Button>
                    </div>
                }
            />
        );
    }

    const isChanged = departmentName.trim() !== originalDepartmentName || 
                     (_selectedCollage && _selectedCollage.collage_id !== originalCollageId);

    return (
        <Dialog
            style={{ width: '40%' }}
            title={`تعديل قسم: ${originalDepartmentName}`}
            body={
                <div className="flex-col justify-center gap-13px">
                    <DialogBody 
                        departmentName={departmentName}
                        error={error}
                        isLoading={isLoading}
                        onInputChange={handleInputChange}
                        onKeyUp={handleKeyUp}
                        collages={collages}
                        selectedCollage={_selectedCollage}
                        onCollageChange={handleCollageChange}
                        originalDepartmentName={originalDepartmentName}
                        originalCollageId={originalCollageId}
                    />
                </div>
            }
            onCloseBtnClick={handleClose}
            footer={
                <div className='flex-row justify-end gap-5px'>
                    <Button 
                        appearance="secondary" 
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        إلغاء
                    </Button>
                    <Button 
                        appearance="primary" 
                        onClick={handleUpdate}
                        disabled={isLoading || !isChanged}
                        icon={isLoading ? <Loading size="tiny" /> : undefined}
                    >
                        {isLoading ? 'جاري التعديل...' : 'تعديل'}
                    </Button>
                </div>
            }
        />
    );
}

function DialogBody({ 
    departmentName, 
    error, 
    isLoading, 
    onInputChange, 
    onKeyUp, 
    collages, 
    selectedCollage, 
    onCollageChange,
    originalDepartmentName,
    originalCollageId
}) {
    const isCollageChanged = selectedCollage && selectedCollage.collage_id !== originalCollageId;

    return (
        <>
            <div className='text-center'>تعديل بيانات القسم</div>

            {/* اختيار الكلية */}
            <div style={{width:'100%'}}>
                <div>الكلية:</div>
                <Dropdown 
                    style={{width:'100%'}}
                    value={selectedCollage ? selectedCollage.collage_name : "اختر كلية"}
                    selectedOptions={selectedCollage ? [selectedCollage.collage_id] : []}
                    onOptionSelect={onCollageChange}
                    placeholder="اختر كلية"
                    disabled={isLoading}
                >
                    {collages.map((c) => (
                        <Option key={c.collage_id} value={c.collage_id}>
                            {c.collage_name}
                        </Option>
                    ))}
                </Dropdown>
                {isCollageChanged && (
                    <div className="paddingY-5px">
                        سيتم تغيير الكلية الخاصة بهذا القسم
                    </div>
                )}
            </div>
            
            {/* عرض اسم القسم الأصلي */}
            <div style={{ 
                padding: '8px 13px', 
                border:'1px solid #ccc', 
                borderRadius: '5px', 
                background: '#f3f2f1',
                marginBottom: '10px'
            }}>
                القسم الأصلي: <span style={{fontWeight:'bold'}}>{originalDepartmentName}</span>
            </div>
            
            {/* إدخال اسم القسم الجديد */}
            <div style={{width:'100%'}}>
                <div className="mb-1 text-sm">اسم القسم الجديد:</div>
                <Input
                    placeholder="أدخل الاسم الجديد للقسم"
                    value={departmentName}
                    onChange={onInputChange}
                    onKeyUp={onKeyUp}
                    disabled={isLoading}
                    style={{width:'100%'}}
                />
            </div>
            
            {error && (
                <div className="error-text text-center">
                    {error}
                </div>
            )}
            {isLoading && (
                <div className="flex items-center justify-center gap-2 mt-2">
                    <span>جاري تعديل القسم...</span>
                </div>
            )}
        </>
    );
}