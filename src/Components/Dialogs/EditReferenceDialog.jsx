import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import Dialog from "./AbstractDialog";
import { clearControlDialog } from "@root/src/store/slices/controlDialogs.slice";
import { Button, Input } from "@fluentui/react-components";
import { updateReference } from "@root/src/services/reference";
import Loading from "@PreMadeComponents/Loading";

export default function EditReferenceDialog({ currentReference }) {
    
    const dispatch = useDispatch();

    const [title, setTitle] = useState('');
    const [link, setLink] = useState('');
    const [author, setAuthor] = useState('');
    const [originalTitle, setOriginalTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // تهيئة البيانات عند تغيير currentReference
    useEffect(() => {
        if (currentReference) {
            setTitle(currentReference.reference_title || '');
            setLink(currentReference.reference_link || '');
            setAuthor(currentReference.reference_author || '');
            setOriginalTitle(currentReference.reference_title || '');
        }
    }, [currentReference]);

    const validateReference = useCallback(() => {
        const trimmedTitle = title.trim();

        if (!trimmedTitle) {
            setError("عنوان المرجع لا يمكن أن يكون فارغًا");
            return false;
        }

        // التحقق إذا لم يتغير شيء
        const isTitleSame = trimmedTitle === originalTitle;
        const isLinkSame = link === (currentReference?.link || '');
        const isAuthorSame = author === (currentReference?.author || '');
        
        if (isTitleSame && isLinkSame && isAuthorSame) {
            setError("لم تقم بإجراء أي تغييرات");
            return false;
        }

        // التحقق من صحة الرابط (إذا تم إدخاله)
        const trimmedLink = link.trim();
        if (trimmedLink.length > 0) {
            const linkRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
            if (!linkRegex.test(trimmedLink)) {
                setError("الرجاء إدخال رابط صحيح");
                return false;
            }
        }

        const titleRegex = /^[A-Za-z\u0600-\u06FF\d][A-Za-z\u0600-\u06FF\d\s-]{2,}$/;
        if (!titleRegex.test(trimmedTitle)) {
            setError("عنوان المرجع غير صالح. يجب أن يبدأ بحرف أو رقم");
            return false;
        }

        setError('');
        return true;
    }, [title, link, author, originalTitle, currentReference]);

    const handleUpdate = useCallback(async () => {
        if (!currentReference || !currentReference.reference_id) {
            setError("لم يتم تحديد مرجع للتعديل");
            return;
        }

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

            const res = await updateReference(currentReference.reference_id, referenceData);
            
            if (res.data?.success) {
                alert(`تم تعديل المرجع "${originalTitle}" إلى "${title.trim()}"`);
                setError('');
                dispatch(clearControlDialog()); // إغلاق الديالوج بعد النجاح
            } else {
                setError('فشل تعديل المرجع. يرجى المحاولة مرة أخرى');
            }
        } catch (err) {
            console.error('Error updating reference:', err);
            setError('فشل تعديل المرجع. يرجى المحاولة مرة أخرى');
        } finally {
            setIsLoading(false);
        }
    }, [title, link, author, currentReference, validateReference, dispatch, originalTitle]);

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

    // إذا لم يكن هناك مرجع محدد، عرض رسالة خطأ
    if (!currentReference) {
        return (
            <Dialog
                style={{ width: '40%' }}
                title={'تعديل مرجع'}
                body={
                    <div style={{ padding: '16px 0', textAlign: 'center', color: 'red' }}>
                        لم يتم تحديد مرجع للتعديل
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

    const isChanged = title.trim() !== originalTitle || 
                     link !== (currentReference?.reference_link || '') || 
                     author !== (currentReference?.reference_author || '');

    return (
        <Dialog
            style={{ width: '40%' }}
            title={`تعديل مرجع: ${originalTitle}`}
            body={
                <DialogBody 
                    title={title}
                    link={link}
                    author={author}
                    error={error}
                    isLoading={isLoading}
                    originalTitle={originalTitle}
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
    title, 
    link, 
    author, 
    error, 
    isLoading, 
    originalTitle,
    onTitleChange, 
    onLinkChange, 
    onAuthorChange, 
    onKeyUp 
}) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '13px' }}>
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>تعديل معلومات المرجع</div>
            
            {/* عرض العنوان الأصلي */}
            {originalTitle && (
                <div style={{ 
                    padding: '8px 13px', 
                    border: '1px solid #ccc', 
                    borderRadius: '5px', 
                    backgroundColor: '#f3f2f1',
                    marginBottom: '10px'
                }}>
                    المرجع الأصلي: <span style={{ fontWeight: 'bold' }}>{originalTitle}</span>
                </div>
            )}
            
            {/* حقل العنوان */}
            <div style={{ width: '100%' }}>
                <div style={{ marginBottom: '5px', fontSize: '14px' }}>عنوان المرجع الجديد:</div>
                <Input
                    style={{ width: '100%' }}
                    placeholder="أدخل عنوان المرجع"
                    value={title}
                    onChange={onTitleChange}
                    onKeyUp={onKeyUp}
                    disabled={isLoading}
                />
            </div>

            {/* حقل الرابط */}
            <div style={{ width: '100%' }}>
                <div style={{ marginBottom: '5px', fontSize: '14px' }}>رابط المرجع:</div>
                <Input
                    style={{ width: '100%' }}
                    placeholder="http://example.com"
                    value={link}
                    onChange={onLinkChange}
                    onKeyUp={onKeyUp}
                    disabled={isLoading}
                />
            </div>

            {/* حقل المؤلف */}
            <div style={{ width: '100%' }}>
                <div style={{ marginBottom: '5px', fontSize: '14px' }}>المؤلف:</div>
                <Input
                    style={{ width: '100%' }}
                    placeholder="اسم المؤلف"
                    value={author}
                    onChange={onAuthorChange}
                    onKeyUp={onKeyUp}
                    disabled={isLoading}
                />
            </div>
            
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
                    <span>جاري تعديل المرجع...</span>
                </div>
            )}
        </div>
    );
}