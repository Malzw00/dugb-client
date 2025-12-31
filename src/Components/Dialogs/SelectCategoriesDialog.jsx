import React, { useState, useCallback, useEffect } from "react";
import Dialog from "./AbstractDialog";
import { Button, Input, tokens, Checkbox, Tag } from "@fluentui/react-components";
import { useDispatch } from "react-redux";
import { clearControlDialog } from "@root/src/store/slices/controlDialog.slice";
import Loading from "@PreMadeComponents/Loading";
import { Search20Regular } from "@fluentui/react-icons";

export default function SelectCategoriesDialog({ collageId, currentCategories = [], onSelect }) {
    
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState(currentCategories);
    const [searchTerm, setSearchTerm] = useState('');
    
    const handleClose = useCallback(() => {
        dispatch(clearControlDialog());
    }, [dispatch]);

    // جلب الفئات حسب الكلية
    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true);
            try {
                // TODO: استدعاء API لجلب الفئات حسب الكلية
                // const response = await getCategoriesByCollage(collageId);
                // setCategories(response.data?.result || []);
                
                // بيانات وهمية للاختبار
                setTimeout(() => {
                    setCategories([
                        { id: 1, name: 'الذكاء الاصطناعي', description: 'مشاريع في مجال الذكاء الاصطناعي' },
                        { id: 2, name: 'تطوير الويب', description: 'مشاريع تطوير تطبيقات الويب' },
                        { id: 3, name: 'تطبيقات الجوال', description: 'مشاريع تطوير تطبيقات الهواتف' },
                        { id: 4, name: 'الأمن السيبراني', description: 'مشاريع في مجال أمن المعلومات' },
                        { id: 5, name: 'علم البيانات', description: 'مشاريع تحليل البيانات والتعلم الآلي' },
                        { id: 6, name: 'الشبكات', description: 'مشاريع في مجال الشبكات والاتصالات' },
                        { id: 7, name: 'قواعد البيانات', description: 'مشاريع في مجال قواعد البيانات' },
                        { id: 8, name: 'الحوسبة السحابية', description: 'مشاريع في مجال الحوسبة السحابية' },
                    ]);
                    setIsLoading(false);
                }, 1000);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setIsLoading(false);
            }
        };

        if (collageId) {
            fetchCategories();
        }
    }, [collageId]);

    const handleToggleCategory = useCallback((category) => {
        setSelectedCategories(prev => {
            const isSelected = prev.some(c => c.id === category.id);
            if (isSelected) {
                return prev.filter(c => c.id !== category.id);
            } else {
                return [...prev, category];
            }
        });
    }, []);

    const handleSelect = useCallback(() => {
        if (onSelect) {
            onSelect(selectedCategories);
        }
        handleClose();
    }, [selectedCategories, onSelect, handleClose]);

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <Dialog
            style={{ width: '60%', minWidth: '600px', maxHeight: '70vh' }}
            title={`تحديد الفئات`}
            body={
                <SelectCategoriesDialogBody 
                    categories={filteredCategories}
                    selectedCategories={selectedCategories}
                    onToggleCategory={handleToggleCategory}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    isLoading={isLoading}
                />
            }
            onCloseBtnClick={handleClose}
            footer={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '14px', fontWeight: '500' }}>
                        تم اختيار {selectedCategories.length} فئة
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
                            تأكيد الاختيار ({selectedCategories.length})
                        </Button>
                    </div>
                </div>
            }
        />
    );
}

function SelectCategoriesDialogBody({ categories, selectedCategories, onToggleCategory, searchTerm, setSearchTerm, isLoading }) {
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                اختر الفئات المناسبة للمشروع (يمكن اختيار أكثر من فئة)
            </div>
            
            {/* شريط البحث */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500' }}>بحث عن فئة</label>
                <Input 
                    placeholder="ابحث باسم الفئة أو الوصف"
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
                    <div style={{ marginTop: '16px' }}>جاري تحميل قائمة الفئات...</div>
                </div>
            ) : categories.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                    {searchTerm ? 'لم يتم العثور على فئات مطابقة للبحث' : 'لا يوجد فئات في هذه الكلية'}
                </div>
            ) : (
                <div style={{ 
                    maxHeight: '300px',
                    overflowY: 'auto',
                    border: `1px solid ${tokens.colorNeutralStroke1}`,
                    borderRadius: '6px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '10px',
                    padding: '10px'
                }}>
                    {categories.map((category) => {
                        const isSelected = selectedCategories.some(c => c.id === category.id);
                        
                        return (
                            <div 
                                key={category.id}
                                style={{
                                    padding: '12px',
                                    border: `1px solid ${isSelected ? tokens.colorBrandStroke1 : tokens.colorNeutralStroke2}`,
                                    backgroundColor: isSelected 
                                        ? tokens.colorBrandBackground2 
                                        : tokens.colorNeutralBackground1,
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onClick={() => onToggleCategory(category)}
                            >
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                    <Checkbox 
                                        checked={isSelected}
                                        style={{ marginTop: '2px' }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '4px' }}>
                                            {category.name}
                                        </div>
                                        {category.description && (
                                            <div style={{ fontSize: '13px', color: tokens.colorNeutralForeground3 }}>
                                                {category.description}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            
            {/* الفئات المحددة */}
            {selectedCategories.length > 0 && !isLoading && (
                <div style={{ marginTop: '10px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                        الفئات المحددة ({selectedCategories.length})
                    </div>
                    <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '8px',
                        padding: '12px',
                        backgroundColor: tokens.colorNeutralBackground2,
                        borderRadius: '6px',
                        border: `1px solid ${tokens.colorNeutralStroke2}`
                    }}>
                        {selectedCategories.map((category) => (
                            <Tag
                                key={category.id}
                                appearance="brand"
                                shape="rounded"
                                style={{ padding: '6px 12px' }}
                            >
                                {category.name}
                            </Tag>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}