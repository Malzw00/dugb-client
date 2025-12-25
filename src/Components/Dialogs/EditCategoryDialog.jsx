import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import Dialog from "./AbstractDialog";
import { clearControlDialog } from "@root/src/store/slices/controlDialogs.slice";
import { Button, Input, Dropdown, Option, tokens } from "@fluentui/react-components";
import { updateCategory } from "@root/src/services/category";
import Loading from "@PreMadeComponents/Loading";

export default function EditCategoryDialog({ currentCategory, collages, selectedCollage  }) {
    
    const dispatch = useDispatch();
    
    const [categoryName, setCategoryName] = useState('');
    const [_selectedCollage, selectCollage] = useState(selectedCollage || null);
    const [originalCollageId, setOriginalCollageId] = useState(null);
    const [originalCategoryName, setOriginalCategoryName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // تهيئة البيانات عند تغيير currentCategory
    useEffect(() => {
        if (currentCategory) {
            setCategoryName(currentCategory.category_name || '');
            setOriginalCategoryName(currentCategory.category_name || '');
            setOriginalCollageId(currentCategory.collage_id);
            
            // البحث عن الكلية الحالية في قائمة الكليات
            const currentCollage = collages?.find(c => c.collage_id === currentCategory.collage_id);
            if (currentCollage) {
                selectCollage(currentCollage);
            }
        }
    }, [currentCategory, collages]);

    const validateCategoryName = useCallback((name) => {
        const trimmedName = name.trim();

        if (!trimmedName) {
            setError("اسم الفئة لا يمكن أن يكون فارغًا");
            return false;
        }

        // التحقق إذا لم يتغير شيء
        const isNameSame = trimmedName === originalCategoryName;
        const isCollageSame = !_selectedCollage || _selectedCollage.collage_id === originalCollageId;
        
        if (isNameSame && isCollageSame) {
            setError("لم تقم بإجراء أي تغييرات");
            return false;
        }

        const categoryNameRegex = /^[A-Za-z\u0600-\u06FF][A-Za-z\u0600-\u06FF\s-]{2,}$/;

        if (!categoryNameRegex.test(trimmedName)) {
            setError(
                "اسم الفئة غير صالح.\n" +
                "يجب أن يبدأ بحرف، ويحتوي فقط على حروف ومسافات أو (-)"
            );
            return false;
        }

        setError('');
        return true;
    }, [originalCategoryName, originalCollageId, _selectedCollage]);

    const handleUpdate = useCallback(async () => {
        if (!currentCategory || !currentCategory.category_id) {
            setError("لم يتم تحديد فئة للتعديل");
            return;
        }

        if (!_selectedCollage || !_selectedCollage.collage_id) {
            setError("يجب تحديد كلية");
            return;
        }

        // التحقق إذا تم تغيير الكلية وطلب التأكيد
        const isCollageChanged = _selectedCollage.collage_id !== originalCollageId;
        if (isCollageChanged) {
            const confirmMessage = `هل أنت متأكد من نقل الفئة "${originalCategoryName}" من الكلية الحالية إلى "${_selectedCollage.collage_name}"؟`;
            if (!window.confirm(confirmMessage)) {
                return;
            }
        }

        if (!validateCategoryName(categoryName)) {
            return;
        }

        setIsLoading(true);
        try {
            const res = await updateCategory(currentCategory.category_id, { 
                name: categoryName.trim(),
                collageId: _selectedCollage.collage_id
            });
            
            if (res.data?.success) {
                alert(`تم تعديل الفئة "${originalCategoryName}" إلى "${categoryName.trim()}"`);
                dispatch(clearControlDialog()); // إغلاق النافذة بعد النجاح
            } else {
                setError(res.data?.message || 'فشل تعديل الفئة. يرجى المحاولة مرة أخرى');
            }
        } catch (err) {
            console.error('Error updating category:', err);
            setError(err.response?.data?.message || 'فشل تعديل الفئة. يرجى المحاولة مرة أخرى');
        } finally {
            setIsLoading(false);
        }
    }, [categoryName, currentCategory, _selectedCollage, dispatch, validateCategoryName, originalCategoryName, originalCollageId]);

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
        setCategoryName(e.target.value);
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

    // إذا لم تكن هناك فئة محددة، عرض رسالة خطأ
    if (!currentCategory) {
        return (
            <Dialog
                style={{ width: '40%' }}
                title={'تعديل فئة'}
                body={
                    <div className="py-4 text-center text-red-500">
                        لم يتم تحديد فئة للتعديل
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
                title={`تعديل فئة: ${originalCategoryName}`}
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

    const isChanged = categoryName.trim() !== originalCategoryName || 
                     (_selectedCollage && _selectedCollage.collage_id !== originalCollageId);

    return (
        <Dialog
            style={{ width: '40%' }}
            title={`تعديل فئة: ${originalCategoryName}`}
            body={
                <div className="flex-col justify-center gap-13px">
                    <DialogBody 
                        categoryName={categoryName}
                        error={error}
                        isLoading={isLoading}
                        onInputChange={handleInputChange}
                        onKeyUp={handleKeyUp}
                        collages={collages}
                        selectedCollage={_selectedCollage}
                        onCollageChange={handleCollageChange}
                        originalCategoryName={originalCategoryName}
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
    categoryName, 
    error, 
    isLoading, 
    onInputChange, 
    onKeyUp, 
    collages, 
    selectedCollage, 
    onCollageChange,
    originalCategoryName,
    originalCollageId
}) {
    const isCollageChanged = selectedCollage && selectedCollage.collage_id !== originalCollageId;

    return (
        <>
            <div className='text-center'>تعديل بيانات الفئة</div>

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
                    <div className="mt-2 text-sm text-orange-600">
                        ⚠️ لاحظ: سيتم تغيير الكلية الخاصة بهذه الفئة
                    </div>
                )}
            </div>
            
            {/* عرض اسم الفئة الأصلي */}
            <div style={{ 
                padding: '8px 13px', 
                border:'1px solid #ccc', 
                borderRadius: '5px', 
                background: tokens.colorNeutralBackground3,
                marginBottom: '10px'
            }}>
                الفئة الأصلية: <span style={{fontWeight:'bold'}}>{originalCategoryName}</span>
            </div>
            
            {/* إدخال اسم الفئة الجديد */}
            <div style={{width:'100%'}}>
                <div className="mb-1 text-sm">اسم الفئة الجديد:</div>
                <Input
                    placeholder="أدخل الاسم الجديد للفئة"
                    value={categoryName}
                    onChange={onInputChange}
                    onKeyUp={onKeyUp}
                    disabled={isLoading}
                    style={{width:'100%'}}
                />
            </div>
            
            {error && (
                <div className="mt-2 text-center text-red-500 whitespace-pre-line">
                    {error}
                </div>
            )}
            {isLoading && (
                <div className="flex items-center justify-center gap-2 mt-2">
                    <span>جاري تعديل الفئة...</span>
                </div>
            )}
        </>
    );
}