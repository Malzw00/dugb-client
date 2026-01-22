import { Tag28Regular, Add20Regular, Dismiss16Regular } from "@fluentui/react-icons";
import Body from "./Body";
import { useEffect, useState, useCallback, useRef } from "react";
import { 
    getProjectKeywords, 
    addProjectKeywords, 
    deleteProjectKeyword 
} from "@root/src/services/project/keyword";
import { 
    Button, 
    Input, 
    Spinner, 
    Text, 
    Badge,
    Tag, 
    tokens
} from "@fluentui/react-components";

export default function ProjectKeywordsBody({ currentProject }) {
    return (
        <Body
            style={{flex:'1'}}
            icon={<Tag28Regular />}
            title={'الكلمات المفتاحية'}
            content={
                <Content 
                    currentProject={currentProject}
                />
            }
        />
    );
}

function Content({ currentProject }) {

    const [keywords, setKeywords] = useState([]);
    const [newKeyword, setNewKeyword] = useState('');
    const [loading, setLoading] = useState(false);
    const [addingKeyword, setAddingKeyword] = useState(false);
    const [deletingKeyword, setDeletingKeyword] = useState(null);
    
    // جلب الكلمات المفتاحية للمشروع
    const fetchProjectKeywords = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getProjectKeywords(currentProject.project_id);
            const keywordsData = res.data?.result || [];
            setKeywords(keywordsData);
        } catch (err) {
            console.error('fetch project keywords failed:', err);
            alert('فشل جلب الكلمات المفتاحية');
        } finally {
            setLoading(false);
        }
    }, [currentProject.project_id]);

    // إضافة كلمة مفتاحية جديدة
    const handleAddKeyword = async () => {
        const trimmedKeyword = newKeyword.trim();
        if (!trimmedKeyword) return;

        setAddingKeyword(true);
        try {
            await addProjectKeywords({ 
                projectId: currentProject.project_id, 
                keywords: [trimmedKeyword] 
            });
            
            // تحديث القائمة فوراً
            fetchProjectKeywords();
            
            setNewKeyword('');
            
        } catch (err) {
            console.error('add keyword failed:', err);
            alert('فشل إضافة الكلمة المفتاحية');
        } finally {
            setAddingKeyword(false);
        }
    };

    // حذف كلمة مفتاحية
    const handleDeleteKeyword = (keyword) => {
        return () => {
            setDeletingKeyword(keyword.keyword_id);
            deleteProjectKeyword({ 
                projectId: currentProject.project_id, 
                keywordId: keyword.keyword_id 
            })
            .then(_ => {
                fetchProjectKeywords();
            })
            .catch(err => {
                console.error('delete keyword failed:', err);
                alert('فشل حذف الكلمة المفتاحية');
            })
            .finally(_ => {
                setDeletingKeyword(null);
            });
        }
    };

    // تحميل الكلمات المفتاحية عند فتح المكون
    useEffect(() => {
        fetchProjectKeywords();
    }, [fetchProjectKeywords]);

    // التعامل مع زر Enter لإضافة كلمة مفتاحية
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && newKeyword.trim()) {
            handleAddKeyword();
        }
    };

    return (
        <div style={{ 
            flex: '1', 
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            padding: '0 55px',
            paddingBottom: '21px',
        }}>

            {/* إضافة كلمة مفتاحية جديدة */}
            <div>
                <Text size={400} weight="semibold" style={{ marginBottom: '8px', display: 'block' }}>
                    إضافة كلمة مفتاحية جديدة
                </Text>
                <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    alignItems: 'flex-start'
                }}>
                    <div style={{ flex: 1 }}>
                        <Input
                            placeholder="أدخل كلمة مفتاحية جديدة"
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            onKeyUp={handleKeyPress}
                            disabled={addingKeyword || loading}
                            style={{ width: '100%' }}
                        />
                        <Text size={200} style={{ color: '#8a8886', marginTop: '4px' }}>
                            اضغط Enter أو زر الإضافة لإدراج الكلمة
                        </Text>
                    </div>
                    <Button
                        appearance="primary"
                        icon={addingKeyword ? <Spinner size="tiny" /> : <Add20Regular />}
                        onClick={handleAddKeyword}
                        disabled={!newKeyword.trim() || addingKeyword || loading}
                        style={{ minWidth: '100px' }}
                    >
                        {addingKeyword ? 'جاري الإضافة...' : 'إضافة'}
                    </Button>
                </div>
            </div>

            {/* قائمة الكلمات المفتاحية */}
            <div>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    marginBottom: '12px'
                }}>
                    <Text size={500} weight="semibold">الكلمات المفتاحية</Text>
                    <Badge appearance="filled" shape="rounded">
                        {keywords.length}
                    </Badge>
                </div>
                
                {loading ? (
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        padding: '40px'
                    }}>
                        <Spinner label="جاري تحميل الكلمات المفتاحية..." />
                    </div>
                ) : keywords.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '32px',
                        backgroundColor: '#faf9f8',
                        borderRadius: '8px',
                        border: '1px dashed #e1dfdd'
                    }}>
                        <Tag28Regular style={{ color: '#8a8886', marginBottom: '12px' }} />
                        <Text>لا توجد كلمات مفتاحية مضافة للمشروع</Text>
                        <Text size={200} style={{ color: '#8a8886', marginTop: '8px' }}>
                            أضف كلمات مفتاحية للمساعدة في تصنيف وتصنيف المشروع
                        </Text>
                    </div>
                ) : (
                    <div style={{ 
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                        backgroundColor: '#faf9f8',
                        padding: '16px',
                        borderRadius: '8px',
                        border: '1px solid #e1dfdd',
                        minHeight: '80px'
                    }}>
                        {keywords.map((keyword) => (
                            <KeywordTag 
                                key={keyword.keyword_id}
                                keyword={keyword}
                                onDelete={handleDeleteKeyword(keyword)}
                                disabled={deletingKeyword === keyword.keyword_id}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* تلميح */}
            <div style={{
                backgroundColor: '#edebe9',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #e1dfdd'
            }}>
                <Text size={300} weight="semibold" style={{ display: 'block', marginBottom: '4px' }}>
                    💡 تلميح
                </Text>
                <Text size={200} style={{ color: '#323130' }}>
                    الكلمات المفتاحية تساعد في تصنيف المشروع وتسهيل البحث عنه. 
                    استخدم كلمات دقيقة تصف موضوع المشروع بدقة.
                </Text>
            </div>
        </div>
    );
}

function KeywordTag({ keyword, onDelete, disabled }) {
    return (
        <Tag
            appearance="brand"
            shape="rounded"
            dismissible
            dismissIcon={<Button
                icon={<Dismiss16Regular color={tokens.colorBrandBackground}/>}
                onClick={onDelete}
                style={{ padding: '0', minWidth: '0', minHeight: '0' }}
                appearance="transparent"
            />}
            disabled={disabled}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 10px',
                fontSize: '14px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.6 : 1,
                border: '1px solid rgba(0, 0, 0, 0.1)'
            }}
        >
            {keyword.keyword}
        </Tag>
    );
}