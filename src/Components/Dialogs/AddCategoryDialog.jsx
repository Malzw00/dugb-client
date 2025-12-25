import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dialog from "./AbstractDialog";
import { clearControlDialog } from "@root/src/store/slices/controlDialogs.slice";
import { Button, Input, tokens } from "@fluentui/react-components";
import { createCategories } from "@root/src/services/category";
import Loading from "@PreMadeComponents/Loading";
import { setCategories } from "@root/src/store/slices/categories.slice";

export default function AddCategoryDialog({ selectedCollage }) {
    
    const dispatch = useDispatch();
    
    const categories = useSelector(state => state.categories?.value || []);
    
    const [categoryName, setCategoryName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const validateCategoryName = useCallback((name) => {
        const trimmedName = name.trim();

        if (!trimmedName) {
            setError("اسم الفئة لا يمكن أن يكون فارغًا");
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
    }, []);

    const handleDone = useCallback(async () => {
        if (!selectedCollage || !selectedCollage.collage_id) {
            setError("لم يتم تحديد كلية لإضافة الفئة إليها");
            return;
        }

        if (!validateCategoryName(categoryName)) {
            return;
        }

        setIsLoading(true);
        try {
            const res = await createCategories({ 
                collageId: selectedCollage.collage_id,
                name: categoryName.trim()
            });
            
            if (res.data?.success) {
                alert(`تم إنشاء فئة بإسم "${res.data?.result?.category_name || categoryName}"`);
                
                // تحديث القائمة في المخزن
                const newCategory = res.data?.result || { 
                    category_id: Date.now(), // مؤقت
                    category_name: categoryName.trim(),
                    collage_id: selectedCollage.collage_id
                };
                
                dispatch(setCategories([...categories, newCategory]));
                setCategoryName('');
                setError('');
            } else {
                setError('فشل إنشاء الفئة. قد يكون الاسم مكرر، يرجى المحاولة مرة أخرى');
            }
        } catch (err) {
            console.error('Error creating category:', err);
            setError('فشل إنشاء الفئة. قد يكون الاسم مكرر، يرجى المحاولة مرة أخرى');
        } finally {
            setIsLoading(false);
        }
    }, [categoryName, selectedCollage, categories, dispatch, validateCategoryName]);

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
        setCategoryName(e.target.value);
        // مسح الخطأ عند بدء الكتابة
        if (error) {
            setError('');
        }
    }, [error]);

    // إذا لم تكن هناك كلية محددة، عرض رسالة خطأ
    if (!selectedCollage) {
        return (
            <Dialog
                style={{ minWidth: '35%' }}
                title={'إضافة فئة'}
                body={
                    <div className="py-4 text-center text-red-500">
                        لم يتم تحديد كلية لإضافة الفئة إليها
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

    return (
        <Dialog
            style={{ width: '40%' }}
            title={`إضافة فئة جديدة - ${selectedCollage.collage_name}`}
            body={
                <DialogBody 
                    categoryName={categoryName}
                    error={error}
                    isLoading={isLoading}
                    onInputChange={handleInputChange}
                    onKeyUp={handleKeyUp}
                    collageName={selectedCollage.collage_name}
                />
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
                        onClick={handleDone}
                        disabled={isLoading || !categoryName.trim()}
                        icon={isLoading ? <Loading size="tiny" /> : undefined}
                    >
                        {isLoading ? 'جاري الإضافة...' : 'إضافة'}
                    </Button>
                </div>
            }
        />
    );
}

function DialogBody({ categoryName, error, isLoading, onInputChange, onKeyUp, collageName }) {
    return (
        <div className="flex-col justify-center gap-13px">
            <div className='text-center'>أدخل اسم الفئة الجديدة</div>
            
            {collageName && (
                <div style={{ padding: '8px 13px', border:'1px solid silver', borderRadius: '5px', background: tokens.colorNeutralBackground3 }}>
                    الكلية المحددة: <span style={{fontWeight:'bold'}}>{collageName}</span>
                </div>
            )}
            
            <Input
                placeholder="اسم الفئة"
                value={categoryName}
                onChange={onInputChange}
                onKeyUp={onKeyUp}
                disabled={isLoading}
            />
            {error && (
                <div className="mt-2 text-center text-red-500 whitespace-pre-line">
                    {error}
                </div>
            )}
            {isLoading && (
                <div className="flex items-center justify-center gap-2 mt-2">
                    <span>جاري إنشاء الفئة...</span>
                </div>
            )}
        </div>
    );
}