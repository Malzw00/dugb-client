import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ControlArea, { Row } from "./ControlArea";
import { Button, Spinner } from "@fluentui/react-components";
import { deleteCollage, getAllCollages } from "@root/src/services/collage";
import { setCollages } from "@root/src/store/slices/collages.slice";
import { setControlDialog } from "@root/src/store/slices/controlDialog.slice";
import Loading from "@PreMadeComponents/Loading";
import EditCollageDialog from "@components/Dialogs/EditCollageDialog";
import AddCollageDialog from "@components/Dialogs/AddCollageDialog";
import { ArrowClockwise20Regular } from "@fluentui/react-icons";

export default function Collages() {
    
    const dispatch = useDispatch();
    const collages = useSelector(state => state.collages.value);
    const controlDialog = useSelector(state => state.controlDialog.value);
    const [editCollage, setEditCollage] = useState({});
    const [loadingStates, setLoadingStates] = useState({});
    const [isLoadingAll, setIsLoadingAll] = useState(false);
    

    const fetchData = useCallback(() => {
        setIsLoadingAll(true);
        getAllCollages()
            .then(res => {
                dispatch(setCollages(res.data?.result || []));
            })
            .catch(err => {
                console.error('Error fetching collages:', err);
                alert('فشل تحميل الكليات. يرجى المحاولة مرة أخرى');
            })
            .finally(() => {
                setIsLoadingAll(false);
            });
    }, [dispatch]);

    useEffect(() => {
        if (collages.length < 1) {
            fetchData();
        }
    }, [collages.length, dispatch]);

    const handleAddDialog = useCallback(() => {
        dispatch(setControlDialog('addCollage'));
    }, [dispatch]);

    const handleEdit = useCallback((collage) => {
        return () => {
            setEditCollage(collage);
            dispatch(setControlDialog('editCollage'));
        };
    }, []);

    const handleDelete = useCallback((collage) => {
        return async () => {
            if (!window.confirm(`هل أنت متأكد من حذف "${collage.collage_name}"؟`)) {
                return;
            }

            // تعيين حالة التحميل لهذا العنصر المحدد
            setLoadingStates(prev => ({
                ...prev,
                [collage.collage_id]: true
            }));

            try {
                const res = await deleteCollage(collage.collage_id);
                if (res.data?.success) {
                    alert(`تم حذف "${collage.collage_name}"`);
                    // تحديث البيانات بعد الحذف
                    const updatedCollages = collages.filter(c => c.collage_id !== collage.collage_id);
                    dispatch(setCollages(updatedCollages));
                }
            } catch (err) {
                console.error('Error deleting collage:', err);
                alert('فشل الحذف. يرجى المحاولة مرة أخرى');
            } finally {
                // إزالة حالة التحميل لهذا العنصر
                setLoadingStates(prev => {
                    const newState = { ...prev };
                    delete newState[collage.collage_id];
                    return newState;
                });
            }
        };
    }, [collages, dispatch]);

    // دالة التحديث
    const handleRefresh = useCallback(() => {
        fetchData();
    }, [fetchData])

    const renderDataContainer = useCallback(() => {
        if (isLoadingAll && collages.length === 0) {
            return (
                <Loading size="extra-large" full vertical text='جار تحميل الكليات...'/>
            );
        }

        if (collages.length === 0 && !isLoadingAll) {
            return (
                <div className="flex-row items-center justify-center placeholder-label padding-21px">
                    لا توجد كليات لعرضها
                </div>
            );
        }

        return collages.map((collage, index) => {
            const isDeleting = loadingStates[collage.collage_id];
            
            return (
                <Row
                    key={collage.collage_id}
                    index={index + 1}
                    name={collage.collage_name}
                    active
                    actions={[
                        {
                            className: 'edit',
                            content: 'تعديل',
                            onClick: handleEdit(collage),
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
                            onClick: handleDelete(collage),
                            disabled: isDeleting
                        },
                    ]}
                />
            );
        });
    }, [collages, isLoadingAll, loadingStates, handleEdit, handleDelete]);

    return (
        <ControlArea
            title={'الكليات والأقسام'}
            toolbar={[
                (<Button 
                    appearance='primary' 
                    onClick={handleAddDialog}
                    disabled={isLoadingAll}
                >
                    إضافة كلية
                </Button>),
                (<Button 
                    appearance='secondary' 
                    onClick={handleRefresh}
                    disabled={isLoadingAll}
                    icon={isLoadingAll && <Loading paddingless size='extra-tiny' /> || <ArrowClockwise20Regular/>}
                >
                    تحديث
                </Button>)
            ]}
            dataContainer={renderDataContainer()}
            footer={<>
                {controlDialog === 'addCollage' && <AddCollageDialog/>}
                {controlDialog === 'editCollage' && <EditCollageDialog currentCollage={editCollage}/>}
            </>}
        />
    );
}