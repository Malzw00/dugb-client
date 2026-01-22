import { Dismiss16Regular, Grid28Regular, MailInbox20Regular, Add16Regular, Add16Filled, MailInbox16Regular, Grid20Regular } from "@fluentui/react-icons";
import Body from "./Body";
import { useEffect, useState, useCallback } from "react";
import { getCategories } from "@root/src/services/category";
import { getProjectCategories, addProjectCategory, deleteProjectCategory } from "@root/src/services/project/category";
import { Button, Dropdown, Option, Spinner, Text, Badge, Field, Tag, tokens } from "@fluentui/react-components";
import Loading from "@PreMadeComponents/Loading";

export default function ProjectCategoriesBody({ currentProject, selectedCollage }) {
    return (
        <Body
            style={{ flex:'1' }}
            icon={<Grid28Regular />}
            title={'فئات المشروع'}
            content={
                <div style={{
                    padding: '0 5%'
                }}>
                    <Content 
                        currentProject={currentProject}
                        selectedCollage={selectedCollage}
                    />
                </div>
            }
        />
    );
}

function Content({ currentProject, selectedCollage }) {

    const [availableCategories, setAvailableCategories] = useState([]);
    const [projectCategories, setProjectCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addingCategory, setAddingCategory] = useState(null);
    const [removingCategory, setRemovingCategory] = useState(null);
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // جلب الفئات المتاحة للكلية المحددة
    const fetchAvailableCategories = useCallback(async () => {
        try {
            const params = selectedCollage ? { collageId: selectedCollage.collage_id } : {};
            const res = await getCategories(params);
            const categories = res.data?.result || [];
            
            // إزالة الفئات المضافة بالفعل للمشروع
            const projectCategoryIds = new Set(projectCategories.map(c => c.category_id));
            const filteredCategories = categories.filter(
                category => !projectCategoryIds.has(category.category_id)
            );
            
            setAvailableCategories(filteredCategories);
        } catch (err) {
            console.error('fetch categories failed:', err);
            alert('فشل جلب الفئات المتاحة');
        }
    }, [selectedCollage, projectCategories]);

    // جلب فئات المشروع الحالية
    const fetchProjectCategories = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getProjectCategories(currentProject.project_id);
            const categories = res.data?.result || [];
            
            setProjectCategories(categories);

        } catch (err) {
            console.error('fetch project categories failed:', err);
            alert('فشل جلب فئات المشروع');
        } finally {
            setLoading(false);
        }
    }, [currentProject.project_id]);

    const handleAddCategory = async () => {
        if (!selectedCategory) {
            alert('يرجى اختيار فئة للإضافة');
            return;
        }

        setAddingCategory(selectedCategory);
        try {
            await addProjectCategory({ 
                projectId: currentProject.project_id, 
                categoryId: selectedCategory 
            });
            
            // تحديث القائمة فوراً
            const categoryToAdd = availableCategories.find(c => c.category_id === selectedCategory);
            if (categoryToAdd) {
                setProjectCategories(prev => [...prev, categoryToAdd]);
            }
            
            // إعادة تعيين الحقول
            setSelectedCategory(null);
            
        } catch (err) {
            console.error('add category failed:', err);
            alert('فشل إضافة الفئة');
        } finally {
            setAddingCategory(null);
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        setRemovingCategory(categoryId);
        try {
            await deleteProjectCategory({ 
                projectId: currentProject.project_id, 
                categoryId 
            });
            
            // تحديث القائمة فوراً
            const removedCategory = projectCategories.find(c => c.category_id === categoryId);
            setProjectCategories(prev => prev.filter(c => c.category_id !== categoryId));
            
        } catch (err) {
            console.error('remove category failed:', err);
            alert('فشل إزالة الفئة');
        } finally {
            setRemovingCategory(null);
        }
    };

    useEffect(() => {
        fetchProjectCategories();
    }, [fetchProjectCategories]);

    useEffect(() => {
        if (showAddCategory) {
            fetchAvailableCategories();
        }
    }, [showAddCategory, fetchAvailableCategories]);

    return (
        <div style={{ 
            flex: '1', 
            paddingRight: '21px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            paddingBottom: '50px'
        }}>

            {/* فئات المشروع الحالية */}
            <div className='flex-col gap-13px'>

                {/* أزرار التحكم */}
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                        onClick={() => setShowAddCategory(!showAddCategory)}
                        appearance="primary"
                        icon={showAddCategory ? <Dismiss16Regular /> : <Add16Regular />}
                    >
                        {showAddCategory ? 'إغلاق إضافة الفئات' : 'إضافة فئة'}
                    </Button>
                </div>

                {showAddCategory && (
                    <div style={{
                        backgroundColor: '#faf9f8',
                        padding: '20px',
                        borderRadius: '8px',
                        border: '1px solid #e1dfdd'
                    }}>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            marginBottom: '16px'
                        }}>
                            <Text size={500} weight="semibold">إضافة فئة</Text>
                            {availableCategories.length > 0 && (
                                <Badge appearance="filled" shape="rounded">
                                    {availableCategories.length}
                                </Badge>
                            )}
                        </div>
                        
                        {loading ? (
                            <Loading full vertical text="جاري جلب الفئات..." />
                        ) : availableCategories.length === 0 ? (
                            <div style={{
                                textAlign: 'center',
                                padding: '24px',
                                backgroundColor: '#f3f2f1',
                                borderRadius: '8px',
                                marginBottom: '16px'
                            }}>
                                <Text>لا توجد فئات متاحة للإضافة</Text>
                            </div>
                        ) : (
                            <>
                                <Field
                                    label="اختر فئة"
                                    style={{ marginBottom: '16px' }}
                                >
                                    <Dropdown
                                        placeholder="اختر فئةً..."
                                        value={
                                            selectedCategory ? 
                                            availableCategories
                                                .find(c => c.category_id === selectedCategory)?.category_name 
                                            : ''
                                        }
                                        selectedOptions={selectedCategory ? [selectedCategory] : []}
                                        onOptionSelect={(_, data) => setSelectedCategory(data.selectedOptions[0])}
                                        style={{ width: '100%' }}
                                    >
                                        {availableCategories.map((category) => (
                                            <Option 
                                                key={category.category_id} 
                                                value={category.category_id}
                                            >
                                                {category.category_name}
                                            </Option>
                                        ))}
                                    </Dropdown>
                                </Field>
                                
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <Button
                                        appearance="primary"
                                        onClick={handleAddCategory}
                                        disabled={!selectedCategory || addingCategory}
                                        icon={addingCategory ? <Spinner size="tiny" /> : <Add16Regular />}
                                    >
                                        {addingCategory ? 'جاري الإضافة...' : 'إضافة الفئة'}
                                    </Button>
                                    <Button
                                        appearance="secondary"
                                        onClick={() => {
                                            setShowAddCategory(false);
                                            setSelectedCategory(null);
                                        }}
                                    >
                                        إلغاء
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                
                {loading ? (
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        padding: '40px'
                    }}>
                        <Spinner label="جاري التحميل..." />
                    </div>
                ) : projectCategories.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '32px',
                        backgroundColor: '#faf9f8',
                        borderRadius: '8px',
                        border: '1px dashed #e1dfdd'
                    }}>
                        <Text>لا يوجد فئات مضافة للمشروع</Text>
                    </div>
                ) : (
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        gap: '8px',
                        backgroundColor: '#faf9f8',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #e1dfdd'
                    }}>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            marginBottom: '13px',
                            gap: '8px'
                        }}>
                            <Text size={500} weight="semibold">الفئات الحالية</Text>
                            <Badge appearance="filled" shape="rounded">
                                {projectCategories.length}
                            </Badge>
                        </div>

                        <div style={{ 
                            display: 'flex', 
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            gap: '8px',
                        }}>
                            {projectCategories.map((category, index) => (
                                <CategoryTag 
                                    key={category.category_id} 
                                    category={category}
                                    dismissable={true}
                                    onDelete={() => handleDeleteCategory(category.category_id)}
                                    disabled={removingCategory === category.category_id}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function CategoryTag({ category, onDelete, dismissable, onClick=()=>{} }) {
    return (
        <Tag style={{
            backgroundColor: 'white',
            borderRadius: '60em',
            border: `1px solid ${tokens.colorNeutralStroke2}`,
            transition: 'all 0.2s',
            padding: `${dismissable || '0 8px'}`,
            textAlign: 'center',
            cursor: `${dismissable || 'pointer'}`
        }}
            icon={<MailInbox16Regular style={{ color: '#0078d4' }} />}
            dismissIcon={dismissable && <Button
                icon={<Dismiss16Regular/>}
                onClick={onDelete}
                style={{ minWidth: '0' }}
                title="إزالة الفئة"
                appearance="transparent"
            />}
            dismissible={true}
            title={category.category_name}
            onClick={onClick}
        >
            {category.category_name}
        </Tag>
    );
}