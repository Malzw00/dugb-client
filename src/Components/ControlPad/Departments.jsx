import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ControlArea, { Row } from "./ControlArea";
import { Button, Dropdown, Option, Spinner } from "@fluentui/react-components";
import { getAllCollages } from "@root/src/services/collage";
import { setCollages } from "@root/src/store/slices/collages.slice";
import { setControlDialog } from "@root/src/store/slices/controlDialog.slice";
import Loading from "@PreMadeComponents/Loading";
import { getDepartments, removeDepartment } from "@root/src/services/collage";
import { setDepartments } from "@root/src/store/slices/departments.slice";
import EditDepartmentDialog from "../Dialogs/EditDepartmentDialog";
import AddDepartmentDialog from "../Dialogs/AddDepartmentDialog";
import { ArrowClockwise20Regular } from "@fluentui/react-icons";
// import AddDepartmentDialog from "@components/Dialogs/AddDepartmentDialog";
// import EditDepartmentDialog from "@components/Dialogs/EditDepartmentDialog";

export default function Departments() {
    
    const dispatch = useDispatch();
    
    const controlDialog = useSelector(state => state.controlDialog.value);
    const departments = useSelector(state => state.departments.value);
    const collages = useSelector(state => state.collages.value);
    const [selectedCollage, selectCollage] = useState(null);
    const [editDepartment, setEditDepartment] = useState({});
    const [loadingStates, setLoadingStates] = useState({});
    const [isLoadingAll, setIsLoadingAll] = useState(false);
    const [isLoadingCollages, setIsLoadingCollages] = useState(false);

    const fetchData = useCallback(() => {
        if (!selectedCollage) return;
        
        setIsLoadingAll(true);
        getDepartments(selectedCollage.collage_id)
            .then(res => {
                dispatch(setDepartments(res.data?.result || []));
            })
            .catch(err => {
                console.error('Error fetching departments:', err);
                alert('فشل تحميل الأقسام. يرجى المحاولة مرة أخرى');
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
        dispatch(setControlDialog('addDepartment'));
    }, [dispatch, selectedCollage]);

    const handleEdit = useCallback((department) => {
        return () => {
            setEditDepartment({ ...department, collage_id: selectedCollage?.collage_id });
            dispatch(setControlDialog('editDepartment'));
        };
    }, []);

    const handleDelete = useCallback((department) => {
        return async () => {
            if (!window.confirm(`هل أنت متأكد من حذف "${department.department_name}"؟`)) {
                return;
            }

            setLoadingStates(prev => ({
                ...prev,
                [department.department_id]: true
            }));

            try {
                const res = await removeDepartment(selectedCollage.collage_id, department.department_id);
                if (res.data?.success) {
                    alert(`تم حذف "${department.department_name}"`);
                    const updatedDepartments = departments.filter(d => d.department_id !== department.department_id);
                    dispatch(setDepartments(updatedDepartments));
                }
            } catch (err) {
                console.error('Error deleting department:', err);
                alert('فشل الحذف. يرجى المحاولة مرة أخرى');
            } finally {
                setLoadingStates(prev => {
                    const newState = { ...prev };
                    delete newState[department.department_id];
                    return newState;
                });
            }
        };
    }, [departments, dispatch]);

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
                    يرجى اختيار كلية لعرض الأقسام
                </div>
            );
        }

        if (isLoadingAll && departments.length === 0) {
            return (
                <Loading size="extra-large" full vertical text='جار تحميل الأقسام...'/>
            );
        }

        if (departments.length === 0 && !isLoadingAll) {
            return (
                <div className="flex-row items-center justify-center placeholder-label padding-21px">
                    لا توجد أقسام لعرضها في {selectedCollage.collage_name}
                </div>
            );
        }

        return departments.map((department, index) => {
            const isDeleting = loadingStates[department.department_id];
            
            return (
                <Row
                    key={department.department_id}
                    index={index + 1}
                    name={department.department_name}
                    active
                    actions={[
                        {
                            className: 'edit',
                            content: 'تعديل',
                            onClick: handleEdit(department),
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
                            onClick: handleDelete(department),
                            disabled: isDeleting
                        },
                    ]}
                />
            );
        });
    }, [departments, isLoadingAll, loadingStates, handleEdit, handleDelete, selectedCollage]);

    return (
        <ControlArea
            title={'الأقسام'}
            toolbar={[
                (<>{isLoadingCollages ? (
                    <div key={0} className="flex-row items-center gap-5px paddingX-13px">
                        <Spinner size="tiny" />
                        <span>جاري تحميل الكليات...</span>
                    </div>
                ) : (
                    
                    <Dropdown 
                        key={1}
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
                    إضافة قسم
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
                {controlDialog === 'addDepartment' && <AddDepartmentDialog selectedCollage={selectedCollage}/>}
                {controlDialog === 'editDepartment' && <EditDepartmentDialog 
                    collages={collages} 
                    currentDepartment={editDepartment}
                    selectedCollage={selectedCollage}
                />}
            </>}
        />
    );
}