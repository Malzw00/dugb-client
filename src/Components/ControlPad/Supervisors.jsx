import React, { useState, useCallback, useEffect } from "react";
import ControlArea, { Row } from "./ControlArea";
import { Button, Link, Spinner, Input } from "@fluentui/react-components";
import { ArrowClockwise20Regular, Dismiss16Regular, Search16Regular } from "@fluentui/react-icons";
import { setControlDialog } from "@root/src/store/slices/controlDialogs.slice";
import Loading from "@PreMadeComponents/Loading";
import { getSupervisors, deleteSupervisor, searchForSupervisors } from "@root/src/services/people";
import { useDispatch, useSelector } from "react-redux";
import AddSupervisorDialog from "@components/Dialogs/AddSupervisorDialog";
import EditSupervisorDialog from "@components/Dialogs/EditSupervisorDialog";

export const academicRanks = [
    { id: 'دكتور', name: 'دكتور' },
    { id: 'أستاذ', name: 'أستاذ' },
    { id: 'مشرف', name: 'مشرف' },
    { id: 'محاظر', name: 'محاظر' },
    { id: 'معيد', name: 'معيد' },
];

export default function Supervisors() {
    const dispatch = useDispatch();
    
    const controlDialog = useSelector(state => state.controlDialog.value);
    const [supervisors, setSupervisors] = useState([]);
    const [loadingStates, setLoadingStates] = useState({});
    const [isLoadingAll, setIsLoadingAll] = useState(false);
    const [editSupervisor, setEditSupervisor] = useState({});
    
    // البحث
    const [searchInputText, setSearchInputText] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    // جلب جميع المشرفين
    const fetchAllSupervisors = useCallback(() => {
        setIsLoadingAll(true);
        
        getSupervisors({})
            .then(res => {
                setSupervisors(res.data?.result || []);
            })
            .catch(err => {
                console.error('Error fetching supervisors:', err);
                alert('فشل تحميل المشرفين. يرجى المحاولة مرة أخرى');
            })
            .finally(() => {
                setIsLoadingAll(false);
            });
    }, []);

    // جلب المشرفين حسب البحث
    const fetchSupervisorsBySearch = useCallback((searchText) => {
        setIsLoadingAll(true);
        setIsSearching(true);
        
        searchForSupervisors({ text: searchText })
            .then(res => {
                setSupervisors(res.data?.result || []);
            })
            .catch(err => {
                console.error('Error searching supervisors:', err);
                alert('فشل في البحث عن المشرفين. يرجى المحاولة مرة أخرى');
            })
            .finally(() => {
                setIsLoadingAll(false);
                setIsSearching(false);
            });
    }, []);

    // جلب البيانات الأولية
    useEffect(() => {
        fetchAllSupervisors();
    }, []);

    const handleAddDialog = useCallback(() => {
        dispatch(setControlDialog('addSupervisor'));
    }, []);

    const handleEdit = useCallback((supervisor) => {
        return () => {
            setEditSupervisor(supervisor);
            dispatch(setControlDialog('editSupervisor'));
        };
    }, []);

    const handleDelete = useCallback((supervisor) => {
        return async () => {
            if (!window.confirm(`هل أنت متأكد من حذف "${supervisor.supervisor_full_name}"؟`)) {
                return;
            }

            setLoadingStates(prev => ({
                ...prev,
                [supervisor.supervisor_id]: true
            }));

            try {
                const res = await deleteSupervisor(supervisor.supervisor_id);
                if (res.data?.success) {
                    alert(`تم حذف "${supervisor.supervisor_full_name}"`);
                    const updatedSupervisors = supervisors.filter(s => s.supervisor_id !== supervisor.supervisor_id);
                    setSupervisors(updatedSupervisors);
                }
            } catch (err) {
                console.error('Error deleting supervisor:', err);
                alert('فشل الحذف. يرجى المحاولة مرة أخرى');
            } finally {
                setLoadingStates(prev => {
                    const newState = { ...prev };
                    delete newState[supervisor.supervisor_id];
                    return newState;
                });
            }
        };
    }, [supervisors]);

    const handleRefresh = useCallback(() => {
        if (searchInputText.trim()) {
            fetchSupervisorsBySearch(searchInputText.trim());
        } else {
            fetchAllSupervisors();
        }
    }, [searchInputText, fetchSupervisorsBySearch, fetchAllSupervisors]);

    const handleSearch = useCallback(() => {
        if (!searchInputText.trim()) {
            fetchAllSupervisors();
            return;
        }
        
        fetchSupervisorsBySearch(searchInputText.trim());
    }, [searchInputText, fetchSupervisorsBySearch, fetchAllSupervisors]);

    const handleSearchInputChange = useCallback((e) => {
        setSearchInputText(e.target.value);
    }, []);

    const handleSearchKeyPress = useCallback((e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }, [handleSearch]);

    const clearSearch = useCallback(() => {
        setSearchInputText("");
        fetchAllSupervisors();
    }, [fetchAllSupervisors]);

    const renderDataContainer = useCallback(() => {
        if (isLoadingAll && supervisors.length === 0) {
            return (
                <Loading size="extra-large" full vertical text='جار تحميل المشرفين...'/>
            );
        }

        if (supervisors.length === 0 && !isLoadingAll) {
            return (
                <div className="flex-row items-center justify-center placeholder-label padding-21px">
                    {searchInputText ? 
                        `لا توجد نتائج للبحث "${searchInputText}"` : 
                        'لا توجد مشرفين لعرضها'
                    }
                </div>
            );
        }

        return supervisors.map((supervisor, index) => {
            const isDeleting = loadingStates[supervisor.supervisor_id];
            
            return (
                <Row
                    key={supervisor.supervisor_id}
                    index={index + 1}
                    name={<div style={{ display:'flex', gap:'13px', flexWrap: 'wrap' }}>
                        {supervisor.supervisor_title|| null}
                        <span style={{ fontWeight: 'bold' }}> 
                            {supervisor.supervisor_name} <span> </span> 
                            {supervisor.supervisor_father_name} <span> </span>
                            {supervisor.supervisor_grandfather_name} <span> </span>
                            {supervisor.supervisor_family_name}
                        </span>
                        
                        {supervisor.supervisor_email && (
                            <Link href={`mailto:${supervisor.supervisor_email}`}>
                                {supervisor.supervisor_email}
                            </Link>
                        )}
                        
                        {supervisor.academic_rank && (
                            <div style={{ 
                                backgroundColor: '#e8f4fd',
                                color: '#0369a1',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '12px'
                            }}>
                                {supervisor.academic_rank}
                            </div>
                        )}
                    </div>}
                    active
                    actions={[
                        {
                            className: 'edit',
                            content: 'تعديل',
                            onClick: handleEdit(supervisor),
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
                            onClick: handleDelete(supervisor),
                            disabled: isDeleting
                        },
                    ]}
                />
            );
        });
    }, [supervisors, isLoadingAll, loadingStates, handleEdit, handleDelete, searchInputText]);

    return (
        <ControlArea
            title={'المشرفون'}
            toolbar={[
                (<div key="search-area" style={{ 
                    display: 'flex', 
                    gap: '13px', 
                    alignItems: 'flex-start', 
                    flexWrap: 'wrap',
                    flexDirection: 'column',
                    width: '100%'
                }}>
                    
                    {/* مربع البحث مع زر البحث */}
                    <div style={{ 
                        display: 'flex', 
                        gap: '5px', 
                        alignItems: 'center',
                        flex: 1,
                        minWidth: '50%'
                    }}>
                        <Input
                            placeholder="ابحث عن مشرف"
                            value={searchInputText}
                            onChange={handleSearchInputChange}
                            onKeyUp={handleSearchKeyPress}
                            disabled={isLoadingAll}
                            style={{ flex: 1 }}
                            contentBefore={<Search16Regular/>}
                            contentAfter={searchInputText && (
                                <Button
                                    appearance="transparent"
                                    onClick={clearSearch}
                                    disabled={isLoadingAll}
                                    icon={<Dismiss16Regular/>}
                                />
                            )}
                        />
                        <Button
                            appearance="primary"
                            icon={<Search16Regular />}
                            onClick={handleSearch}
                            disabled={isLoadingAll || isSearching}
                            style={{ minWidth: '80px' }}
                        />
                    </div>

                    {/* أزرار الإضافة والتحديث */}
                    <div key="action-buttons" style={{ 
                        display: 'flex', 
                        gap: '5px',
                        alignItems: 'center'
                    }}>
                        <Button
                            appearance='primary' 
                            onClick={handleAddDialog}
                            disabled={isLoadingAll}
                        >
                            إضافة مشرف
                        </Button>
                        <Button 
                            appearance='secondary' 
                            onClick={handleRefresh}
                            disabled={isLoadingAll}
                            icon={isLoadingAll ? <Loading paddingless size='extra-tiny' /> : <ArrowClockwise20Regular/>}
                        >
                            تحديث
                        </Button>
                    </div>
                </div>),
            ]}
            dataContainer={renderDataContainer()}
            footer={<>
                {controlDialog === 'addSupervisor' && <AddSupervisorDialog 
                    onSupervisorAdded={() => {
                        handleRefresh();
                        clearSearch();
                    }}
                />}
                {controlDialog === 'editSupervisor' && <EditSupervisorDialog 
                    currentSupervisor={editSupervisor}
                    onSupervisorUpdated={handleRefresh}
                />}
            </>}
        />
    );
}