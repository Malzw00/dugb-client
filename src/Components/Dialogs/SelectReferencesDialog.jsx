import React, { useState, useCallback, useEffect } from "react";
import Dialog from "./AbstractDialog";
import { Button, Input, tokens, Checkbox, Tag } from "@fluentui/react-components";
import { useDispatch } from "react-redux";
import { clearControlDialog } from "@root/src/store/slices/controlDialog.slice";
import Loading from "@PreMadeComponents/Loading";
import { Search20Regular, Add20Regular } from "@fluentui/react-icons";

export default function SelectReferencesDialog({ currentReferences = [], onSelect }) {
    
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [references, setReferences] = useState([]);
    const [selectedReferences, setSelectedReferences] = useState(currentReferences);
    const [searchTerm, setSearchTerm] = useState('');
    const [newReference, setNewReference] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    
    const handleClose = useCallback(() => {
        dispatch(clearControlDialog());
    }, [dispatch]);

    // جلب المراجع
    useEffect(() => {
        const fetchReferences = async () => {
            setIsLoading(true);
            try {
                // TODO: استدعاء API لجلب المراجع
                // const response = await getReferences();
                // setReferences(response.data?.result || []);
                
                // بيانات وهمية للاختبار
                setTimeout(() => {
                    setReferences([
                        { id: 1, title: 'Introduction to Algorithms', authors: 'Thomas H. Cormen', year: 2009 },
                        { id: 2, title: 'Clean Code', authors: 'Robert C. Martin', year: 2008 },
                        { id: 3, title: 'Design Patterns', authors: 'Erich Gamma', year: 1994 },
                        { id: 4, title: 'The Pragmatic Programmer', authors: 'Andrew Hunt', year: 1999 },
                        { id: 5, title: 'Structure and Interpretation of Computer Programs', authors: 'Harold Abelson', year: 1996 },
                        { id: 6, title: 'Artificial Intelligence: A Modern Approach', authors: 'Stuart Russell', year: 2020 },
                        { id: 7, title: 'Database System Concepts', authors: 'Abraham Silberschatz', year: 2019 },
                        { id: 8, title: 'Computer Networks', authors: 'Andrew S. Tanenbaum', year: 2013 },
                    ]);
                    setIsLoading(false);
                }, 1000);
            } catch (error) {
                console.error('Error fetching references:', error);
                setIsLoading(false);
            }
        };

        fetchReferences();
    }, []);

    const handleToggleReference = useCallback((reference) => {
        setSelectedReferences(prev => {
            const isSelected = prev.some(r => r.id === reference.id);
            if (isSelected) {
                return prev.filter(r => r.id !== reference.id);
            } else {
                return [...prev, reference];
            }
        });
    }, []);

    const handleAddReference = useCallback(() => {
        if (newReference.trim()) {
            const newRef = {
                id: Date.now(), // ID مؤقت
                title: newReference.trim(),
                authors: '',
                year: new Date().getFullYear()
            };
            setReferences(prev => [newRef, ...prev]);
            setSelectedReferences(prev => [...prev, newRef]);
            setNewReference('');
            setShowAddForm(false);
        }
    }, [newReference]);

    const handleSelect = useCallback(() => {
        if (onSelect) {
            onSelect(selectedReferences);
        }
        handleClose();
    }, [selectedReferences, onSelect, handleClose]);

    const filteredReferences = references.filter(reference =>
        reference.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (reference.authors && reference.authors.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <Dialog
            style={{ width: '70%', minWidth: '700px', maxHeight: '80vh' }}
            title={`تحديد المراجع`}
            body={
                <SelectReferencesDialogBody 
                    references={filteredReferences}
                    selectedReferences={selectedReferences}
                    onToggleReference={handleToggleReference}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    isLoading={isLoading}
                    newReference={newReference}
                    setNewReference={setNewReference}
                    showAddForm={showAddForm}
                    setShowAddForm={setShowAddForm}
                    onAddReference={handleAddReference}
                />
            }
            onCloseBtnClick={handleClose}
            footer={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '14px', fontWeight: '500' }}>
                        تم اختيار {selectedReferences.length} مرجع
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Button 
                            appearance="secondary" 
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            إلغاء
                        </Button>
                        <Button 
                            appearance="primary" 
                            onClick={handleSelect}
                            disabled={isLoading}
                        >
                            تأكيد الاختيار ({selectedReferences.length})
                        </Button>
                    </div>
                </div>
            }
        />
    );
}

function SelectReferencesDialogBody({ 
    references, 
    selectedReferences, 
    onToggleReference, 
    searchTerm, 
    setSearchTerm, 
    isLoading,
    newReference,
    setNewReference,
    showAddForm,
    setShowAddForm,
    onAddReference
}) {
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                اختر المراجع العلمية للمشروع (يمكن اختيار أكثر من مرجع)
            </div>
            
            {/* زر إضافة مرجع جديد */}
            {!showAddForm && (
                <Button 
                    appearance="primary"
                    icon={<Add20Regular />}
                    onClick={() => setShowAddForm(true)}
                    disabled={isLoading}
                    style={{ alignSelf: 'flex-start' }}
                >
                    إضافة مرجع جديد
                </Button>
            )}
            
            {/* نموذج إضافة مرجع جديد */}
            {showAddForm && (
                <div style={{ 
                    padding: '16px',
                    backgroundColor: tokens.colorNeutralBackground2,
                    borderRadius: '6px',
                    border: `1px solid ${tokens.colorNeutralStroke2}`
                }}>
                    <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>
                        إضافة مرجع جديد
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                        <Input 
                            placeholder="أدخل عنوان المرجع الجديد"
                            value={newReference}
                            onChange={(e) => setNewReference(e.target.value)}
                            style={{ flex: 1 }}
                            onKeyUp={(e) => e.key === 'Enter' && onAddReference()}
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Button 
                                appearance="secondary"
                                onClick={() => {
                                    setShowAddForm(false);
                                    setNewReference('');
                                }}
                            >
                                إلغاء
                            </Button>
                            <Button 
                                appearance="primary"
                                onClick={onAddReference}
                                disabled={!newReference.trim()}
                            >
                                إضافة
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* شريط البحث */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500' }}>بحث عن مرجع</label>
                <Input 
                    placeholder="ابحث بعنوان المرجع أو المؤلف"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={isLoading}
                    contentBefore={<Search20Regular />}
                />
            </div>
            
            {/* حالة التحميل */}
            {isLoading ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>
                    <Loading size="medium" />
                    <div style={{ marginTop: '16px' }}>جاري تحميل قائمة المراجع...</div>
                </div>
            ) : references.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                    {searchTerm ? 'لم يتم العثور على مراجع مطابقة للبحث' : 'لا يوجد مراجع متاحة'}
                </div>
            ) : (
                <div style={{ 
                    maxHeight: '350px',
                    overflowY: 'auto',
                    border: `1px solid ${tokens.colorNeutralStroke1}`,
                    borderRadius: '6px',
                    padding: '10px'
                }}>
                    {references.map((reference) => {
                        const isSelected = selectedReferences.some(r => r.id === reference.id);
                        
                        return (
                            <div 
                                key={reference.id}
                                style={{
                                    padding: '12px',
                                    border: `1px solid ${isSelected ? tokens.colorBrandStroke1 : tokens.colorNeutralStroke2}`,
                                    backgroundColor: isSelected 
                                        ? tokens.colorBrandBackground2 
                                        : tokens.colorNeutralBackground1,
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    marginBottom: '8px'
                                }}
                                onClick={() => onToggleReference(reference)}
                            >
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                    <Checkbox 
                                        checked={isSelected}
                                        style={{ marginTop: '2px' }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '4px' }}>
                                            {reference.title}
                                        </div>
                                        <div style={{ fontSize: '13px', color: tokens.colorNeutralForeground3, marginBottom: '2px' }}>
                                            المؤلفون: {reference.authors}
                                        </div>
                                        <div style={{ fontSize: '12px', color: tokens.colorNeutralForeground3 }}>
                                            سنة النشر: {reference.year}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            
            {/* المراجع المحددة */}
            {selectedReferences.length > 0 && !isLoading && (
                <div style={{ marginTop: '10px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                        المراجع المحددة ({selectedReferences.length})
                    </div>
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        gap: '8px',
                        padding: '12px',
                        backgroundColor: tokens.colorNeutralBackground2,
                        borderRadius: '6px',
                        border: `1px solid ${tokens.colorNeutralStroke2}`
                    }}>
                        {selectedReferences.map((reference) => (
                            <div 
                                key={reference.id}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '8px 12px',
                                    backgroundColor: tokens.colorNeutralBackground1,
                                    borderRadius: '4px'
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{reference.title}</div>
                                    <div style={{ fontSize: '12px', color: tokens.colorNeutralForeground3 }}>
                                        {reference.authors} ({reference.year})
                                    </div>
                                </div>
                                <Tag appearance="brand" size="small">
                                    مضافة
                                </Tag>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}