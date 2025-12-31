import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ControlArea, { Row } from "./ControlArea";
import { Button, Dropdown, Option, Spinner } from "@fluentui/react-components";
import { getAllCollages } from "@root/src/services/collage";
import { setCollages } from "@root/src/store/slices/collages.slice";
import { setControlDialog } from "@root/src/store/slices/controlDialog.slice";
import Loading from "@PreMadeComponents/Loading";
import { getCategories, deleteCategory } from "@root/src/services/category";
import { setCategories } from "@root/src/store/slices/categories.slice";
import AddCategoryDialog from "@components/Dialogs/AddCategoryDialog";
import EditCategoryDialog from "@components/Dialogs/EditCategoryDialog";
import { ArrowClockwise20Regular } from "@fluentui/react-icons";

export default function Categories() {
    
    const dispatch = useDispatch();
    
    const controlDialog = useSelector(state => state.controlDialog.value);
    const categories = useSelector(state => state.categories.value);
    const collages = useSelector(state => state.collages.value);
    const [selectedCollage, selectCollage] = useState(null);
    const [editCategory, setEditCategory] = useState({});
    const [loadingStates, setLoadingStates] = useState({});
    const [isLoadingAll, setIsLoadingAll] = useState(false);
    const [isLoadingCollages, setIsLoadingCollages] = useState(false);

    const fetchData = useCallback(() => {
        if (!selectedCollage) return;
        
        setIsLoadingAll(true);
        getCategories({ collageId: selectedCollage.collage_id })
            .then(res => {
                dispatch(setCategories(res.data?.result || []));
            })
            .catch(err => {
                console.error('Error fetching categories:', err);
                alert('فشل تحميل الفئات. يرجى المحاولة مرة أخرى');
            })
            .finally(() => {
                setIsLoadingAll(false);
            });
    }, [dispatch, selectedCollage]);

    useEffect(() => {
        if (collages.length === 0) {
            setIsLoadingCollages(true);
            getAllCollages({})
                .then(res => {
                    const collagesData = res.data?.result || [];
                    dispatch(setCollages(collagesData));
                    if (collagesData.length > 0) {
                        selectCollage(collagesData[0]); // تمرير الكائن كاملًا
                    }
                })
                .catch(err => {
                    console.error('Error fetching collages:', err);
                    alert('فشل تحميل الكليات. يرجى المحاولة مرة أخرى');
                })
                .finally(() => {
                    setIsLoadingCollages(false);
                });
        }
    }, [collages.length, dispatch]);

    useEffect(() => {
        if (selectedCollage) {
            fetchData();
        }
    }, [selectedCollage, fetchData]);

    const handleAddDialog = useCallback(() => {
        if (!selectedCollage) return;
        dispatch(setControlDialog('addCategory'));
    }, [dispatch, selectedCollage]);

    const handleEdit = useCallback((category) => {
        return () => {
            setEditCategory({ ...category, collage_id: selectedCollage?.collage_id });
            dispatch(setControlDialog('editCategory'));
        };
    }, []);

    const handleDelete = useCallback((category) => {
        return async () => {
            if (!window.confirm(`هل أنت متأكد من حذف "${category.category_name}"؟`)) {
                return;
            }

            setLoadingStates(prev => ({
                ...prev,
                [category.category_id]: true
            }));

            try {
                const res = await deleteCategory(category.category_id);
                if (res.data?.success) {
                    alert(`تم حذف "${category.category_name}"`);
                    const updatedCategories = categories.filter(c => c.category_id !== category.category_id);
                    dispatch(setCategories(updatedCategories));
                }
            } catch (err) {
                console.error('Error deleting category:', err);
                alert('فشل الحذف. يرجى المحاولة مرة أخرى');
            } finally {
                setLoadingStates(prev => {
                    const newState = { ...prev };
                    delete newState[category.category_id];
                    return newState;
                });
            }
        };
    }, [categories, dispatch]);

    const handleRefresh = useCallback(() => {
        if (selectedCollage) {
            fetchData();
        }
    }, [fetchData, selectedCollage]);

    const handleDropdownSelect = (_, data) => {
        if (data.selectedOptions && data.selectedOptions[0]) {
            const selectedId = data.selectedOptions[0];
            const foundCollage = collages.find(c => c.collage_id === selectedId);
            if (foundCollage) {
                selectCollage(foundCollage);
            }
        }
    };

    const renderDataContainer = useCallback(() => {
        if (!selectedCollage) {
            return (
                <div className="flex-row items-center justify-center placeholder-label padding-21px">
                    يرجى اختيار كلية لعرض الفئات
                </div>
            );
        }

        if (isLoadingAll && categories.length === 0) {
            return (
                <Loading size="extra-large" full vertical text='جار تحميل الفئات...'/>
            );
        }

        if (categories.length === 0 && !isLoadingAll) {
            return (
                <div className="flex-row items-center justify-center placeholder-label padding-21px">
                    لا توجد فئات لعرضها في {selectedCollage.collage_name}
                </div>
            );
        }

        return categories.map((category, index) => {
            const isDeleting = loadingStates[category.category_id];
            
            return (
                <Row
                    key={index}
                    index={index + 1}
                    name={category.category_name}
                    active
                    actions={[
                        {
                            className: 'edit',
                            content: 'تعديل',
                            onClick: handleEdit(category),
                            disabled: isDeleting
                        },
                        {
                            className: 'delete',
                            content: isDeleting ? (
                                <>
                                    <Spinner size="tiny" style={{ marginLeft: '4px' }} />
                                    جاري الحذف...
                                </>
                            ) : 'حذف',
                            onClick: handleDelete(category),
                            disabled: isDeleting
                        },
                    ]}
                />
            );
        });
    }, [categories, isLoadingAll, loadingStates, handleEdit, handleDelete, selectedCollage]);

    return (
        <ControlArea
            title={'الفئات'}
            toolbar={[
                (<>{isLoadingCollages ? (
                    <div className="flex-row items-center gap-5px paddingX-13px">
                        <Spinner size="tiny" />
                        <span>جاري تحميل الكليات...</span>
                    </div>
                ) : (
                    
                    <Dropdown 
                        value={selectedCollage ? selectedCollage.collage_name : "اختر كلية"}
                        selectedOptions={selectedCollage ? [selectedCollage.collage_id] : []}
                        onOptionSelect={handleDropdownSelect}
                        placeholder="اختر كلية"
                    >
                        {collages.map((c) => (
                            <Option key={c.collage_id} value={c.collage_id}>
                                {c.collage_name}
                            </Option>
                        ))}
                    </Dropdown>
                )}</>),
                (<Button
                    key={2}
                    appearance='primary' 
                    onClick={handleAddDialog}
                    disabled={isLoadingAll || !selectedCollage}
                >
                    إضافة فئة
                </Button>),
                (<Button 
                    key={3}
                    appearance='secondary' 
                    onClick={handleRefresh}
                    disabled={isLoadingAll || !selectedCollage}
                    icon={isLoadingAll ? <Loading paddingless size='extra-tiny' /> : <ArrowClockwise20Regular/>}
                >
                    تحديث
                </Button>)
            ]}
            dataContainer={renderDataContainer()}
            footer={<>
                {controlDialog === 'addCategory' && <AddCategoryDialog selectedCollage={selectedCollage}/>}
                {controlDialog === 'editCategory' && <EditCategoryDialog 
                    collages={collages} 
                    currentCategory={editCategory}
                    selectedCollage={selectedCollage}
                />}
            </>}
        />
    );
}