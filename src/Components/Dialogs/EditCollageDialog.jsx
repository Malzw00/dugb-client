import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dialog from "./AbstractDialog";
import { clearControlDialog } from "@root/src/store/slices/controlDialog.slice";
import { Button, Input, Spinner, tokens } from "@fluentui/react-components";
import { updateCollage } from "@root/src/services/collage";


export default function EditCollageDialog({ currentCollage }) {
    
    const dispatch = useDispatch();

    const collages = useSelector(state => state.collages.value);
    
    const [collageName, setCollageName] = useState(currentCollage?.collage_name || '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (currentCollage) {
            setCollageName(currentCollage.collage_name || '');
        }
    }, [currentCollage]);

    const validateCollageName = useCallback((name) => {
        const trimmedName = name.trim();

        if (!trimmedName) {
            setError("اسم الكلية لا يمكن أن يكون فارغًا");
            return false;
        }

        // التحقق إذا كان الاسم نفس الاسم الحالي (لا داعي للتعديل)
        if (trimmedName === currentCollage?.collage_name) {
            setError("لم تقم بتغيير اسم الكلية");
            return false;
        }

        const collageNameRegex = /^[A-Za-z\u0600-\u06FF][A-Za-z\u0600-\u06FF\s-]{2,}$/;

        if (!collageNameRegex.test(trimmedName)) {
            setError(
                "اسم الكلية غير صالح.\n" +
                "يجب أن يبدأ بحرف، ويحتوي فقط على حروف ومسافات أو (-)"
            );
            return false;
        }

        setError('');
        return true;
    }, [currentCollage]);

    const handleUpdate = useCallback(async () => {
        if (!currentCollage || !currentCollage.collage_id) {
            setError("لم يتم تحديد كلية للتعديل");
            return;
        }

        if (!validateCollageName(collageName)) {
            return;
        }

        setIsLoading(true);
        try {
            const res = await updateCollage(
                currentCollage.collage_id, 
                { collageName: collageName.trim() }
            );
            
            if (res.data?.success) {
                alert(`تم تعديل اسم الكلية إلى "${res.data?.result?.collage_name || collageName}"`);
                setError('');
                dispatch(clearControlDialog());
            } else {
                const serverError = res.data?.success || 'لم يتم تحديث اسم الكلية، تأكد من أن الإسم غير موجود مسبقا';
                setError(serverError);
            }
        } catch (err) {
            console.error('Error updating collage:', err);
            setError('لم يتم تحديث اسم الكلية، تأكد من أن الإسم غير موجود مسبقا');
            
        } finally {
            setIsLoading(false);
        }
    }, [collageName, currentCollage, collages, dispatch, validateCollageName]);

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
        setCollageName(e.target.value);
        // مسح الخطأ عند بدء الكتابة
        if (error) {
            setError('');
        }
    }, [error]);

    // إذا لم تكن هناك كلية محددة، عرض رسالة خطأ
    if (!currentCollage) {
        return (
            <Dialog
                style={{ width: '40%' }}
                title={'تعديل كلية'}
                body={
                    <div className="py-4 text-center text-red-500">
                        لم يتم تحديد كلية للتعديل
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
            title={`تعديل كلية: ${currentCollage.collage_name}`}
            body={
                <DialogBody 
                    collageName={collageName}
                    error={error}
                    isLoading={isLoading}
                    onInputChange={handleInputChange}
                    onKeyUp={handleKeyUp}
                    originalName={currentCollage.collage_name}
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
                        onClick={handleUpdate}
                        disabled={isLoading || !collageName.trim() || collageName === currentCollage.collage_name}
                        icon={isLoading ? <Spinner size="tiny" /> : undefined}
                    >
                        {isLoading ? 'جاري التعديل...' : 'تعديل'}
                    </Button>
                </div>
            }
        />
    );
}

function DialogBody({ collageName, error, isLoading, onInputChange, onKeyUp, originalName }) {
    return (
        <div className="flex-col justify-center gap-13px">
            <div className='text-center'>قم بتعديل اسم الكلية</div>
            
            {originalName && (
                <div style={{ 
                    background: tokens.colorNeutralBackground3, 
                    borderRadius: '5px',
                    padding: '8px 13px',
                    border:'1px solid silver', }}>
                    الاسم الحالي: <span style={{fontWeight:'bold'}}>{originalName}</span>
                </div>
            )}
            
            <Input
                placeholder="الاسم الجديد للكلية"
                value={collageName}
                onChange={onInputChange}
                onKeyUp={onKeyUp}
                disabled={isLoading}
                appearance={error ? "filled-darker-error" : undefined}
            />
            
            {error && (
                <div className="text-sm text-red-500 whitespace-pre-line">
                    {error}
                </div>
            )}
            
            {isLoading && (
                <div className="flex items-center justify-center gap-2 mt-2">
                    <span style={{color: tokens.colorNeutralForeground2}}>جاري تعديل الكلية...</span>
                </div>
            )}
        </div>
    );
}