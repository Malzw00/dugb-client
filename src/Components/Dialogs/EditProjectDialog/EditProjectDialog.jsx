import Dialog from "@components/Dialogs/AbstractDialog";
import SideBar from "./SideBar";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { clearControlDialog } from "@root/src/store/slices/controlDialog.slice";
import ProjectDataBody from "./ProjectDataBody";
import ProjectTeamBody from "./ProjectTeamBody";
import { getProjectById } from "@root/src/services/project/project";
import { Spinner, Text } from "@fluentui/react-components";
import { ErrorCircle24Regular } from "@fluentui/react-icons";
import ProjectCategoriesBody from "./ProjectCategoriesBody";
import ProjectKeywordsBody from "./ProjectkeywordsBody";
import ProjectReferencesBody from "./ProjectReferencesBody";
import ProjectFilesBody from "./ProjectFilesBody";


const EditProjectDialog = ({ 
    collages, 
    departments, 
    currentProject, 
    selectedCollage 
}) => {
    const dispatch = useDispatch();
    const [projectData, setProjectData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // جلب بيانات المشروع
    useEffect(() => {
        const fetchProjectData = async () => {
            if (!currentProject?.project_id) {
                setError('معرف المشروع غير متوفر');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const response = await getProjectById(currentProject.project_id);
                
                if (response?.data?.result) {
                    setProjectData(response.data.result);
                } else {
                    setError('بيانات المشروع غير متوفرة');
                }
            } catch (err) {
                console.error('فشل في جلب بيانات المشروع:', err);
                setError('حدث خطأ أثناء جلب بيانات المشروع');
            } finally {
                setLoading(false);
            }
        };

        fetchProjectData();
    }, [currentProject?.project_id]); // الاعتماد على project_id فقط

    const handleClose = useCallback(() => {
        dispatch(clearControlDialog());
    }, [dispatch]);

    // حساب إذا كانت البيانات جاهزة للعرض
    const isDataReady = useMemo(() => 
        !loading && !error && Object.keys(projectData).length > 0,
        [loading, error, projectData]
    );

    // تنسيق خطأ قابل للعرض
    const renderError = useMemo(() => {
        if (!error) return null;
        
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                padding: '40px',
                gap: '12px'
            }}>
                <ErrorCircle24Regular style={{ color: '#d13438', fontSize: '48px' }} />
                <Text size={400} weight="semibold" align="center">
                    {error}
                </Text>
            </div>
        );
    }, [error]);

    return (
        <Dialog
            style={{ width: '80%', height: '95%', minWidth: '300px' }}
            title={'تعديل بيانات المشروع - ' + (currentProject?.project_title?? '')}
            body={
                loading ? (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                        padding: '40px'
                    }}>
                        <Spinner 
                            label="جاري تحميل بيانات المشروع..." 
                            labelPosition="below"
                            size="large"
                        />
                    </div>
                ) : error ? (
                    renderError
                ) : isDataReady ? (
                    <DialogBody
                        collages={collages}
                        departments={departments}
                        project={projectData}
                        selectedCollage={selectedCollage}
                    />
                ) : null
            }
            bodyStyle={{ 
                display: 'flex', 
                flexDirection: 'row', 
                flex: '1', 
                width: 'auto',
                minHeight: '400px'
            }}
            onCloseBtnClick={handleClose}
        />
    );
};

export const DialogBody = ({ 
    departments, 
    project, 
    selectedCollage 
}) => {
    const [currentBody, setCurrentBody] = useState('info');

    const handleTabSelected = useCallback((e, data) => {
        setCurrentBody(data.value);
    }, []);

    const bodyComponents = useMemo(() => ({
        info: (
            <ProjectDataBody
                key="info"
                departments={departments}
                currentProject={project}
                selectedCollage={selectedCollage}
            />
        ),
        team: (
            <ProjectTeamBody
                key="team"
                departments={departments}
                currentProject={project}
                selectedCollage={selectedCollage}
            />
        ),
        categories: (
            <ProjectCategoriesBody
                key='categories'
                currentProject={project}
                selectedCollage={selectedCollage}
            />
        ),
        references: (
            <ProjectReferencesBody
                key='references'
                currentProject={project}
                selectedCollage={selectedCollage}
            />
        ),
        keywords: (
            <ProjectKeywordsBody
                key={'keywords'}
                currentProject={project}
            />
        ),
        files: (
            <ProjectFilesBody
                key={'files'}
                currentProject={project}
            />
        )
    }), [departments, project, selectedCollage]);

    return (
        <>
            <SideBar 
                selectedTab={currentBody} 
                onTabSelect={handleTabSelected}
            />
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                height: '100%',
                flex: '1'
            }}>
                {bodyComponents[currentBody]}
            </div>
        </>
    );
};

export default EditProjectDialog;