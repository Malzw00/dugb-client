import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import Dialog from "./AbstractDialog";
import { clearControlDialog } from "@root/src/store/slices/controlDialog.slice";
import { Button, Input } from "@fluentui/react-components";
import { createReference } from "@root/src/services/reference";
import Loading from "@PreMadeComponents/Loading";

export default function AddReferenceDialog() {
    
    const dispatch = useDispatch();

    const [title, setTitle] = useState('');
    const [link, setLink] = useState('');
    const [author, setAuthor] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const validateReference = useCallback(() => {
        const trimmedTitle = title.trim();
        const trimmedLink = link.trim();

        if (!trimmedTitle) {
            setError("عنوان المرجع لا يمكن أن يكون فارغًا");
            return false;
        }

        // التحقق من صحة الرابط (اختياري)
        const linkRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        if (trimmedLink.length > 0 && !linkRegex.test(trimmedLink)) {
            setError("الرجاء إدخال رابط صحيح");
            return false;
        }

        const titleRegex = /^[A-Za-z\u0600-\u06FF\d][A-Za-z\u0600-\u06FF\d\s-]{2,}$/;
        if (!titleRegex.test(trimmedTitle)) {
            setError("عنوان المرجع غير صالح. يجب أن يبدأ بحرف");
            return false;
        }

        setError('');
        return true;
    }, [title, link]);

    const handleDone = useCallback(async () => {
        if (!validateReference()) {
            return;
        }

        setIsLoading(true);
        try {
            const referenceData = {
                title: title.trim(),
                ...(link.trim() && { link: link.trim() }),
                ...(author.trim() && { author: author.trim() }),
            };

            const res = await createReference(referenceData);
            
            if (res.data?.success) {
                alert(`تم إضافة المرجع "${res.data?.result?.title || title}"`);
                setTitle('');
                setLink('');
                setAuthor('');
                setError('');
                dispatch(clearControlDialog()); // إغلاق الديالوج بعد النجاح
            } else {
                setError('فشل إضافة المرجع. يرجى المحاولة مرة أخرى');
            }
        } catch (err) {
            console.error('Error creating reference:', err);
            setError('فشل إضافة المرجع. يرجى المحاولة مرة أخرى');
        } finally {
            setIsLoading(false);
        }
    }, [title, link, author, validateReference, dispatch]);

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

    const handleTitleChange = useCallback((e) => {
        setTitle(e.target.value);
        if (error) setError('');
    }, [error]);

    const handleLinkChange = useCallback((e) => {
        setLink(e.target.value);
        if (error) setError('');
    }, [error]);

    const handleAuthorChange = useCallback((e) => {
        setAuthor(e.target.value);
        if (error) setError('');
    }, [error]);

    return (
        <Dialog
            style={{ width: '40%' }}
            title={'إضافة مرجع جديد'}
            body={
                <DialogBody 
                    title={title}
                    link={link}
                    author={author}
                    error={error}
                    isLoading={isLoading}
                    onTitleChange={handleTitleChange}
                    onLinkChange={handleLinkChange}
                    onAuthorChange={handleAuthorChange}
                    onKeyUp={handleKeyUp}
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
                        disabled={isLoading || !title.trim()}
                        icon={isLoading ? <Loading size="tiny" /> : undefined}
                    >
                        {isLoading ? 'جاري الإضافة...' : 'إضافة'}
                    </Button>
                </div>
            }
        />
    );
}

function DialogBody({ 
    title, 
    link, 
    author, 
    error, 
    isLoading, 
    onTitleChange, 
    onLinkChange, 
    onAuthorChange, 
    onKeyUp 
}) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '13px' }}>
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>أدخل معلومات المرجع الجديد</div>
            
            {/* حقل العنوان */}
            <Input
                placeholder="أدخل عنوان المرجع"
                value={title}
                onChange={onTitleChange}
                onKeyUp={onKeyUp}
                disabled={isLoading}
            />

            {/* حقل الرابط */}
            <Input
                placeholder="رابط المرجع (اختياري) : http://example.com"
                value={link}
                onChange={onLinkChange}
                onKeyUp={onKeyUp}
                disabled={isLoading}
            />

            {/* حقل المؤلف (اختياري) */}
            <Input
                placeholder="اسم المؤلف"
                value={author}
                onChange={onAuthorChange}
                onKeyUp={onKeyUp}
                disabled={isLoading}
            />
            
            {error && (
                <div style={{ 
                    marginTop: '10px', 
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
                    marginTop: '10px'
                }}>
                    <span>جاري إضافة المرجع...</span>
                </div>
            )}
        </div>
    );
}