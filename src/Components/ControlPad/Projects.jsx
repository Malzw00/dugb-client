import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ControlArea, { Row } from "./ControlArea";
import { Button, Dropdown, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger, Option, Spinner } from "@fluentui/react-components";
import { getAllCollages, getDepartments } from "@root/src/services/collage";
import { setCollages } from "@root/src/store/slices/collages.slice";
import { setControlDialog } from "@root/src/store/slices/controlDialog.slice";
import Loading from "@PreMadeComponents/Loading";
import { getProjects, deleteProject } from "@services/project/project";
import { setProjects } from "@root/src/store/slices/projects.slice";
import { ArrowClockwise20Regular, Book16Regular, Bookmark16Regular, CloudWords16Regular, Folder16Regular, Grid16Regular, Key16Regular, List16Regular, Options20Regular, People16Regular, Screenshot16Regular } from "@fluentui/react-icons";
import AddProjectDialog from "@components/Dialogs/AddProjectDialog";
import EditProjectDialog from "@components/Dialogs/EditProjectDialog/EditProjectDialog";

export default function Projects() {
    
    const dispatch = useDispatch();
    
    const controlDialog = useSelector(state => state.controlDialog.value);
    const [projects, setLocalProjects] = useState([]);
    const reduxProjects = useSelector(state => state.projects.value);
    const collages = useSelector(state => state.collages.value);
    const [selectedCollage, selectCollage] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [editProject, setEditProject] = useState({});
    const [loadingStates, setLoadingStates] = useState({});
    const [isLoadingAll, setIsLoadingAll] = useState(false);
    const [isLoadingCollages, setIsLoadingCollages] = useState(false);
    const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
    const [filters, setFilters] = useState({
        semester: "",
        departmentId: null,
        sortBy: "date",
        order: "DESC",
        limit: 20,
        offset: 0
    });

    // دالة لجلب الأقسام عند تغيير الكلية
    const fetchDepartments = useCallback(async (collageId) => {
        if (!collageId) {
            setDepartments([]);
            setSelectedDepartment(null);
            return;
        }
        
        setIsLoadingDepartments(true);
        try {
            const res = await getDepartments(collageId);
            const departmentsData = res.data?.result || [];
            setDepartments(departmentsData);
            // تعيين القيمة الافتراضية إلى "كل الأقسام"
            setSelectedDepartment(null);
            setFilters(prev => ({ ...prev, departmentId: null }));
        } catch (err) {
            console.error('Error fetching departments:', err);
            alert('فشل تحميل الأقسام. يرجى المحاولة مرة أخرى');
        } finally {
            setIsLoadingDepartments(false);
        }
    }, []);

    const fetchData = useCallback(() => {
        if (!selectedCollage) return;
        
        setIsLoadingAll(true);
        getProjects({
            collageId: selectedCollage.collage_id,
            departmentId: filters.departmentId || undefined,
            semester: filters.semester || undefined,
        })
            .then(res => {
                const projectsData = res.data?.result?.projects || [];
                setLocalProjects(projectsData);
                dispatch(setProjects(projectsData));
            })
            .catch(err => {
                console.error('Error fetching projects:', err);
                alert('فشل تحميل المشاريع. يرجى المحاولة مرة أخرى');
            })
            .finally(() => {
                setIsLoadingAll(false);
            });
    }, [dispatch, selectedCollage, filters]);

    useEffect(() => {
        if (collages.length === 0) {
            setIsLoadingCollages(true);
            getAllCollages({})
                .then(res => {
                    const collagesData = res.data?.result || [];
                    dispatch(setCollages(collagesData));
                    if (collagesData.length > 0) {
                        selectCollage(collagesData[0]);
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
            fetchDepartments(selectedCollage.collage_id);
        }
    }, [selectedCollage, fetchDepartments]);

    useEffect(() => {
        if (selectedCollage) {
            fetchData();
        }
    }, [selectedCollage, fetchData, filters]);

    const handleAddDialog = useCallback(() => {
        if (!selectedCollage) return;
        dispatch(setControlDialog('addProject'));
    }, [dispatch, selectedCollage]);

    const handleEdit = useCallback((project) => {
        return () => {
            setEditProject({ ...project, collage_id: selectedCollage?.collage_id });
            dispatch(setControlDialog('editProject'));
        };
    }, [selectedCollage]);

    const handleDelete = useCallback((project) => {
        return async () => {
            if (!window.confirm(`هل أنت متأكد من حذف "${project.project_title}"؟`)) {
                return;
            }

            setLoadingStates(prev => ({
                ...prev,
                [project.project_id]: true
            }));

            try {
                const res = await deleteProject(project.project_id);
                if (res.data?.success) {
                    alert(`تم حذف "${project.project_title}"`);
                    handleRefresh();
                }
            } catch (err) {
                console.error('Error deleting project:', err);
                alert('فشل الحذف. يرجى المحاولة مرة أخرى');
            } finally {
                setLoadingStates(prev => {
                    const newState = { ...prev };
                    delete newState[project.project_id];
                    return newState;
                });
            }
            handleRefresh();
        };
    }, [reduxProjects, dispatch]);

    const handleRefresh = useCallback(() => {
        if (selectedCollage) {
            fetchData();
        }
    }, [fetchData, selectedCollage]);

    const handleCollageSelect = (_, data) => {
        if (data.selectedOptions && data.selectedOptions[0]) {
            const selectedId = data.selectedOptions[0];
            const foundCollage = collages.find(c => c.collage_id === selectedId);
            if (foundCollage) {
                selectCollage(foundCollage);
            }
        }
    };

    const handleDepartmentSelect = (_, data) => {
        if (data.selectedOptions && data.selectedOptions[0]) {
            const selectedId = data.selectedOptions[0];
            if (selectedId === "all") {
                setSelectedDepartment(null);
                setFilters(prev => ({ ...prev, departmentId: null }));
            } else {
                const foundDepartment = departments.find(d => d.department_id === selectedId);
                if (foundDepartment) {
                    setSelectedDepartment(foundDepartment);
                    setFilters(prev => ({ ...prev, departmentId: foundDepartment.department_id }));
                }
            }
        }
    };

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    const handleFiles = () => {

    }

    const renderDataContainer = useCallback(() => {
        if (!selectedCollage) {
            return (
                <div className="flex-row items-center justify-center placeholder-label padding-21px">
                    يرجى اختيار كلية لعرض المشاريع
                </div>
            );
        }

        if (isLoadingAll && projects.length === 0) {
            return (
                <Loading size="extra-large" full vertical text='جار تحميل المشاريع...'/>
            );
        }

        if (projects.length === 0 && !isLoadingAll) {
            const departmentText = selectedDepartment 
                ? `القسم: ${selectedDepartment.department_name}` 
                : "كل الأقسام";
                
            return (
                <div className="flex-row items-center justify-center placeholder-label padding-21px">
                    لا توجد مشاريع لعرضها في {selectedCollage.collage_name} ({departmentText})
                </div>
            );
        }

        return projects?.map?.((project, index) => {
            const isDeleting = loadingStates[project.project_id];
            
            return (
                <Row
                    key={project.project_id}
                    index={index + 1}
                    name={project.project_title}
                    active={true}
                    onClick={handleEdit(project)}
                    actions={[
                        {
                            className: 'delete',
                            content: (isDeleting ? (
                                <Spinner size="tiny"/>
                            ) : 'حذف'),
                            onClick: handleDelete(project),
                            disabled: isDeleting
                        },
                    ]}
                />
            );
        });
    }, [projects, isLoadingAll, loadingStates, departments, selectedDepartment, selectedCollage, handleEdit, handleDelete]);

    return (
        <ControlArea
            title={'المشاريع'}
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
                        onOptionSelect={handleCollageSelect}
                        placeholder="اختر كلية"
                        // style={{ minWidth: '150px' }}
                    >
                        {collages.map((c) => (
                            <Option key={c.collage_id} value={c.collage_id}>
                                {c.collage_name}
                            </Option>
                        ))}
                    </Dropdown>
                )}</>),
                
                (<>{isLoadingDepartments ? (
                    <div className="flex-row items-center gap-5px paddingX-13px">
                        <Spinner size="tiny" />
                        <span>جاري تحميل الأقسام...</span>
                    </div>
                ) : (
                    <Dropdown
                        key="department-filter"
                        value={selectedDepartment ? selectedDepartment.department_name : "كل الأقسام"}
                        selectedOptions={selectedDepartment ? [selectedDepartment.department_id] : ["all"]}
                        onOptionSelect={handleDepartmentSelect}
                        placeholder="اختر قسم"
                        disabled={!selectedCollage || departments.length === 0}
                        // style={{ minWidth: '150px' }}
                    >
                        <Option value="all">كل الأقسام</Option>
                        {departments.map((d) => (
                            <Option key={d.department_id} value={d.department_id}>
                                {d.department_name}
                            </Option>
                        ))}
                    </Dropdown>
                )}</>),
                
                (<Dropdown
                    key="semester-filter"
                    value={filters.semester?.toLowerCase() || "جميع الفصول"}
                    onOptionSelect={(_, data) => handleFilterChange('semester', data.selectedOptions[0] || "")}
                    placeholder="الفصل الدراسي"
                    disabled={!selectedCollage}
                    style={{ maxWidth: '100px' }}
                >
                    <Option value="">جميع الفصول</Option>
                    <Option text="ربيع" value="spring">ربيع</Option>
                    <Option text="خريف" value="autumn">خريف</Option>
                </Dropdown>),
                <br/>,
                <div style={{ display: 'flex', gap: '5px' }}>
                    <Button
                        key="add-project"
                        appearance='primary' 
                        onClick={handleAddDialog}
                        disabled={isLoadingAll || !selectedCollage}
                    >
                        توثيق مشروع
                    </Button>
                    
                    <Button 
                        key="refresh"
                        appearance='secondary' 
                        onClick={handleRefresh}
                        disabled={isLoadingAll || !selectedCollage}
                        icon={isLoadingAll ? <Loading paddingless size='extra-tiny' /> : <ArrowClockwise20Regular/>}
                    >
                        تحديث
                    </Button>
                </div>
            ]}
            dataContainer={renderDataContainer()}
            footer={<>
                {controlDialog === 'addProject' && <AddProjectDialog 
                    selectedCollage={selectedCollage}
                    departments={departments}
                />}
                {controlDialog === 'editProject' && <EditProjectDialog 
                    collages={collages} 
                    departments={departments}
                    currentProject={editProject}
                    selectedCollage={selectedCollage}
                />}
            </>}
        />
    );
}


function ProjectOptions ({ onFiles, onKeywords, onProjectData, onReferences, onCategories, onPeople }) {

    return <Menu positioning={{ autoSize: true }}>
        
        <MenuTrigger disableButtonEnhancement>
            <button style={{ background:'transparent', border: 'none' }}>
                تعديل
            </button>
        </MenuTrigger>

        <MenuPopover>
            <MenuList>
                <MenuItem icon={<Folder16Regular/>} onClick={onProjectData || (() => {})}>
                    البيانات الأساسية
                </MenuItem>
                <MenuItem icon={<Book16Regular/>} onClick={onFiles || (() => {})}>
                    الملفات
                </MenuItem>
                <MenuItem icon={<People16Regular/>} onClick={onPeople || (() => {})}>
                    فريق العمل
                </MenuItem>
                <MenuItem icon={<Bookmark16Regular/>} onClick={onReferences || (() => {})}>
                    المراجع
                </MenuItem>
                <MenuItem icon={<Grid16Regular/>} onClick={onCategories || (() => {})}>
                    الفئات
                </MenuItem>
                <MenuItem icon={<Key16Regular/>} onClick={onKeywords || (() => {})}>
                    الكلمات المفتاحية
                </MenuItem>
            </MenuList>
        </MenuPopover>

    </Menu>
}