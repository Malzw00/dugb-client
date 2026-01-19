import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import Dialog from "./AbstractDialog";
import { clearControlDialog } from "@root/src/store/slices/controlDialog.slice";
import { Button, Input, Spinner } from "@fluentui/react-components";
import { createCollage } from "@root/src/services/collage";
import Loading from "../PreMadeComponents/Loading";

export default function AddCollageDialog() {
    
    const dispatch = useDispatch();
    const [collageName, setCollageName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const validateCollageName = useCallback((name) => {
        const trimmedName = name.trim();

        if (!trimmedName) {
            setError("اسم الكلية لا يمكن أن يكون فارغًا");
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
    }, []);

    const handleDone = useCallback(async () => {
        if (!validateCollageName(collageName)) {
            return;
        }

        setIsLoading(true);
        try {
            const res = await createCollage({ collageName: collageName.trim() });
            alert(`تم إنشاء كلية بإسم "${res.data?.result?.collage_name || collageName}"`);
            setCollageName('');
            setError('');
        } catch (err) {
            console.error('Error creating collage:', err);
            setError(err.response.data?.message || 'فشل إنشاء كلية. يرجى المحاولة مرة أخرى');
        } finally {
            setIsLoading(false);
        }
    }, [collageName, validateCollageName]);

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
        setCollageName(e.target.value);
        // Clear error when user starts typing
        if (error) {
            setError('');
        }
    }, [error]);

    return (
        <Dialog
            style={{ width: '40%' }}
            title={'إضافة كلية'}
            body={
                <DialogBody 
                    collageName={collageName}
                    error={error}
                    isLoading={isLoading}
                    onInputChange={handleInputChange}
                    onKeyUp={handleKeyUp}
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
                        disabled={isLoading || !collageName.trim()}
                        icon={isLoading ? <Loading size="tiny" /> : undefined}
                    >
                        {isLoading ? 'جاري الإضافة...' : 'إضافة'}
                    </Button>
                </div>
            }
        />
    );
}



function DialogBody({ collageName, error, isLoading, onInputChange, onKeyUp }) {
    return (
        <div className="flex-col justify-center gap-13px">
            <div className='text-center'>أدخل اسم الكلية</div>
            <Input
                placeholder="اسم الكلية"
                value={collageName}
                onChange={onInputChange}
                onKeyUp={onKeyUp}
                disabled={isLoading}
            />
            {error && (
                <div className="error-text text-center">
                    {error}
                </div>
            )}
            {isLoading && (
                <div className="flex items-center justify-center gap-2 mt-2">
                    <span>جاري إنشاء الكلية...</span>
                </div>
            )}
        </div>
    );
}