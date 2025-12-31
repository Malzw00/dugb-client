import React, { useState, useCallback, useEffect } from "react";
import ControlArea, { Row } from "./ControlArea";
import { Button, Link, Spinner } from "@fluentui/react-components";
import { setControlDialog } from "@root/src/store/slices/controlDialog.slice";
import Loading from "@PreMadeComponents/Loading";
import { getReferences, deleteReference } from "@root/src/services/reference";
import { useDispatch, useSelector } from "react-redux";
import AddReferenceDialog from "@components/Dialogs/AddReferenceDialog";
import EditReferenceDialog from "@components/Dialogs/EditReferenceDialog";
import { ArrowClockwise20Regular } from "@fluentui/react-icons";



export default function References() {

    const dispatch = useDispatch();
    
    const controlDialog = useSelector(state => state.controlDialog.value);
    const [references, setReferences] = useState([]);
    const [loadingStates, setLoadingStates] = useState({});
    const [isLoadingAll, setIsLoadingAll] = useState(false);
    const [editReference, setEditReference] = useState({});

    const fetchData = useCallback(() => {
        setIsLoadingAll(true);
        getReferences({})
            .then(res => {
                setReferences(res.data?.result || []);
            })
            .catch(err => {
                console.error('Error fetching references:', err);
                alert('فشل تحميل المراجع. يرجى المحاولة مرة أخرى');
            })
            .finally(() => {
                setIsLoadingAll(false);
            });
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddDialog = useCallback(() => {
        dispatch(setControlDialog('addReference'));
    }, []);

    const handleEdit = useCallback((reference) => {
        return () => {
            setEditReference(reference);
            dispatch(setControlDialog('editReference'));
        };
    }, []);

    const handleDelete = useCallback((reference) => {
        return async () => {
            if (!window.confirm(`هل أنت متأكد من حذف "${reference.reference_title}"؟`)) {
                return;
            }

            setLoadingStates(prev => ({
                ...prev,
                [reference.reference_id]: true
            }));

            try {
                const res = await deleteReference(reference.reference_id);
                if (res.data?.success) {
                    alert(`تم حذف "${reference.reference_title}"`);
                    const updatedReferences = references.filter(r => r.reference_id !== reference.reference_id);
                    setReferences(updatedReferences);
                }
            } catch (err) {
                console.error('Error deleting reference:', err);
                alert('فشل الحذف. يرجى المحاولة مرة أخرى');
            } finally {
                setLoadingStates(prev => {
                    const newState = { ...prev };
                    delete newState[reference.reference_id];
                    return newState;
                });
            }
        };
    }, [references]);

    const handleRefresh = useCallback(() => {
        fetchData();
    }, [fetchData]);

    const renderDataContainer = useCallback(() => {
        if (isLoadingAll && references.length === 0) {
            return (
                <Loading size="extra-large" full vertical text='جار تحميل المراجع...'/>
            );
        }

        if (references.length === 0 && !isLoadingAll) {
            return (
                <div className="flex-row items-center justify-center placeholder-label padding-21px">
                    لا توجد مراجع لعرضها
                </div>
            );
        }

        return references.map((reference, index) => {
            const isDeleting = loadingStates[reference.reference_id];
            
            return (
                <Row
                    key={reference.reference_id}
                    index={index + 1}
                    name={<div style={{ display:'flex', gap:'13px' }}>
                        {reference.reference_title} 
                        
                        {reference.reference_link && <Link href={reference.reference_link}>
                            {reference.reference_link}
                        </Link>}
                        
                        {reference.reference_author && <div>
                            ( {reference.reference_author} )
                        </div>}
                    </div>}
                    active
                    actions={[
                        {
                            className: 'edit',
                            content: 'تعديل',
                            onClick: handleEdit(reference),
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
                            onClick: handleDelete(reference),
                            disabled: isDeleting
                        },
                    ]}
                />
            );
        });
    }, [references, isLoadingAll, loadingStates, handleEdit, handleDelete]);

    return (
        <ControlArea
            title={'المراجع'}
            toolbar={[
                (<Button
                    key={1}
                    appearance='primary' 
                    onClick={handleAddDialog}
                    disabled={isLoadingAll}
                >
                    إضافة مرجع
                </Button>),
                (<Button 
                    key={2}
                    appearance='secondary' 
                    onClick={handleRefresh}
                    disabled={isLoadingAll}
                    icon={isLoadingAll ? <Loading paddingless size='extra-tiny' /> : <ArrowClockwise20Regular/>}
                >
                    تحديث
                </Button>)
            ]}
            dataContainer={renderDataContainer()}
            footer={<>
                {controlDialog === 'addReference' && <AddReferenceDialog />}
                {controlDialog === 'editReference' && <EditReferenceDialog 
                    currentReference={editReference}
                />}
            </>}
        />
    );
}