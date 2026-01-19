import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import Dialog from "./AbstractDialog";
import { clearControlDialog } from "@root/src/store/slices/controlDialog.slice";
import { Button, Input, tokens } from "@fluentui/react-components";
import { updateReference } from "@root/src/services/reference";
import Loading from "@PreMadeComponents/Loading";

export default function EditReferenceDialog({ currentReference }) {
    
    const dispatch = useDispatch();

    const [title, setTitle] = useState('');
    const [link, setLink] = useState('');
    const [author, setAuthor] = useState('');
    const [originalTitle, setOriginalTitle] = useState('');
    const [originalLink, setOriginalLink] = useState('');
    const [originalAuthor, setOriginalAuthor] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // تهيئة البيانات عند تغيير currentReference
    useEffect(() => {
        if (currentReference) {
            setTitle(currentReference.reference_title || '');
            setLink(currentReference.reference_link || '');
            setAuthor(currentReference.reference_author || '');
            setOriginalTitle(currentReference.reference_title || '');
            setOriginalLink(currentReference.reference_link || '');
            setOriginalAuthor(currentReference.reference_author || '');
        }
    }, [currentReference]);

    const validateReference = useCallback(() => {
        const trimmedTitle = title.trim();

        if (!trimmedTitle) {
            setError("عنوان المرجع لا يمكن أن يكون فارغًا");
            return false;
        }

        // التحقق من صحة الرابط (إذا تم إدخاله وكان غير فارغ)
        const trimmedLink = link.trim();
        if (trimmedLink.length > 0) {
            try {
                // استخدام URL للتحقق من صحة الرابط
                new URL(trimmedLink.includes('://') ? trimmedLink : `https://${trimmedLink}`);
            } catch (err) {
                setError("الرجاء إدخال رابط صحيح (مثال: https://example.com)");
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
    }, [title, link]);

    // التحقق إذا تم تغيير أي حقل
    const hasChanges = useCallback(() => {
        const trimmedTitle = title.trim();
        const trimmedLink = link.trim();
        const trimmedAuthor = author.trim();
        
        // مقارنة القيم بعد التقطيع مع القيم الأصلية
        return (
            trimmedTitle !== originalTitle.trim() ||
            trimmedLink !== originalLink.trim() ||
            trimmedAuthor !== originalAuthor.trim()
        );
    }, [title, link, author, originalTitle, originalLink, originalAuthor]);

    const handleUpdate = useCallback(async () => {
        if (!currentReference || !currentReference.reference_id) {
            setError("لم يتم تحديد مرجع للتعديل");
            return;
        }

        // التحقق أولاً إذا كان هناك تغييرات
        if (!hasChanges()) {
            setError("لم تقم بإجراء أي تغييرات");
            return;
        }

        if (!validateReference()) {
            return;
        }

        setIsLoading(true);
        try {
            const referenceData = {
                title: title.trim(),
                link: link.trim() || null, // إرسال null إذا كان فارغاً
                author: author.trim() || null, // إرسال null إذا كان فارغاً
            };

            const res = await updateReference(currentReference.reference_id, referenceData);
            
            if (res.data?.success) {
                const newTitle = title.trim();
                const successMessage = originalTitle.trim() === newTitle 
                    ? `تم تعديل المرجع "${originalTitle}"`
                    : `تم تعديل المرجع "${originalTitle}" إلى "${newTitle}"`;
                
                alert(successMessage);
                setError('');
                dispatch(clearControlDialog()); // إغلاق الديالوج بعد النجاح
            } else {
                setError('فشل تعديل المرجع. يرجى المحاولة مرة أخرى');
            }
        } catch (err) {
            console.error('Error updating reference:', err);
            const errorMessage = err.response?.data?.message || 'فشل تعديل المرجع. يرجى المحاولة مرة أخرى';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [title, link, author, currentReference, validateReference, hasChanges, dispatch, originalTitle]);

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

    const isChanged = hasChanges();

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
                    originalLink={originalLink}
                    originalAuthor={originalAuthor}
                    hasChanges={isChanged}
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
    originalLink,
    originalAuthor,
    hasChanges,
    onTitleChange, 
    onLinkChange, 
    onAuthorChange, 
    onKeyUp 
}) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '13px' }}>
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>تعديل معلومات المرجع</div>
            
            {/* عرض القيم الأصلية */}
            <div style={{ 
                padding: '8px 13px', 
                border: `1px solid ${tokens.colorNeutralStroke1}`, 
                borderRadius: '5px', 
                backgroundColor: tokens.colorNeutralBackground2,
                marginBottom: '10px'
            }}>
                <div style={{ marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>القيم الأصلية:</div>
                <div>العنوان: <span style={{ fontWeight: '500' }}>{originalTitle}</span></div>
                <div>الرابط: <span style={{ fontWeight: '500', color: originalLink ? '#0078d4' : '#666' }}>
                    {originalLink || '(غير محدد)'}
                </span></div>
                <div>المؤلف: <span style={{ fontWeight: '500', color: originalAuthor ? '#0078d4' : '#666' }}>
                    {originalAuthor || '(غير محدد)'}
                </span></div>
            </div>
            
            {/* حقل العنوان */}
            <div style={{ width: '100%' }}>
                <div style={{ marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                    عنوان المرجع الجديد <span style={{ color: 'red' }}>*</span>:
                </div>
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
                <div style={{ marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>رابط المرجع:</div>
                <Input
                    style={{ width: '100%' }}
                    placeholder="https://example.com (اختياري)"
                    value={link}
                    onChange={onLinkChange}
                    onKeyUp={onKeyUp}
                    disabled={isLoading}
                />
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    {link.trim() === originalLink.trim() && '(سيتم حذف الرابط إذا تركته فارغاً)'}
                </div>
            </div>

            {/* حقل المؤلف */}
            <div style={{ width: '100%' }}>
                <div style={{ marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>المؤلف:</div>
                <Input
                    style={{ width: '100%' }}
                    placeholder="اسم المؤلف (اختياري)"
                    value={author}
                    onChange={onAuthorChange}
                    onKeyUp={onKeyUp}
                    disabled={isLoading}
                />
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    {author.trim() === originalAuthor.trim() && '(سيتم حذف المؤلف إذا تركته فارغاً)'}
                </div>
            </div>
            
            {error && (
                <div className="error-text">
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
                    <Loading size="tiny" />
                    <span>جاري تعديل المرجع...</span>
                </div>
            )}
        </div>
    );
}