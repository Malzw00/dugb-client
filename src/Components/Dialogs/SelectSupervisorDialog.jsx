import React, { useState, useCallback, useEffect } from "react";
import Dialog from "./AbstractDialog";
import { Button, Input, Dropdown, Option, tokens, Checkbox, Avatar } from "@fluentui/react-components";
import { useDispatch } from "react-redux";
import { clearControlDialog } from "@root/src/store/slices/controlDialog.slice";
import Loading from "@PreMadeComponents/Loading";
import { Search20Regular } from "@fluentui/react-icons";

export default function SelectSupervisorDialog({ departmentId, currentSupervisor, onSelect }) {
    
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [supervisors, setSupervisors] = useState([]);
    const [selectedSupervisor, setSelectedSupervisor] = useState(currentSupervisor || null);
    const [searchTerm, setSearchTerm] = useState('');
    
    const handleClose = useCallback(() => {
        dispatch(clearControlDialog());
    }, [dispatch]);

    // جلب المشرفين حسب القسم
    useEffect(() => {
        const fetchSupervisors = async () => {
            setIsLoading(true);
            try {
                // TODO: استدعاء API لجلب المشرفين حسب القسم
                // const response = await getSupervisorsByDepartment(departmentId);
                // setSupervisors(response.data?.result || []);
                
                // بيانات وهمية للاختبار
                setTimeout(() => {
                    setSupervisors([
                        { id: 1, name: 'أ.د. أحمد محمد', email: 'ahmed@university.edu', title: 'أستاذ' },
                        { id: 2, name: 'د. سارة علي', email: 'sara@university.edu', title: 'أستاذ مساعد' },
                        { id: 3, name: 'د. خالد حسن', email: 'khaled@university.edu', title: 'أستاذ مشارك' },
                        { id: 4, name: 'أ. مريم عبدالله', email: 'mariam@university.edu', title: 'مدرس' },
                    ]);
                    setIsLoading(false);
                }, 1000);
            } catch (error) {
                console.error('Error fetching supervisors:', error);
                setIsLoading(false);
            }
        };

        if (departmentId) {
            fetchSupervisors();
        }
    }, [departmentId]);

    const handleSelect = useCallback(() => {
        if (selectedSupervisor && onSelect) {
            onSelect(selectedSupervisor);
        }
        handleClose();
    }, [selectedSupervisor, onSelect, handleClose]);

    const filteredSupervisors = supervisors.filter(supervisor =>
        supervisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supervisor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supervisor.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Dialog
            style={{ width: '50%', minWidth: '500px', maxHeight: '70vh' }}
            title={`تحديد المشرف`}
            body={
                <SelectSupervisorDialogBody 
                    supervisors={filteredSupervisors}
                    selectedSupervisor={selectedSupervisor}
                    setSelectedSupervisor={setSelectedSupervisor}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    isLoading={isLoading}
                />
            }
            onCloseBtnClick={handleClose}
            footer={
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: '8px' }}>
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
                        disabled={isLoading || !selectedSupervisor}
                    >
                        تأكيد الاختيار
                    </Button>
                </div>
            }
        />
    );
}

function SelectSupervisorDialogBody({ supervisors, selectedSupervisor, setSelectedSupervisor, searchTerm, setSearchTerm, isLoading }) {
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                اختر مشرفاً من القائمة
            </div>
            
            {/* شريط البحث */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500' }}>بحث عن مشرف</label>
                <Input 
                    placeholder="ابحث بالاسم أو البريد الإلكتروني أو اللقب"
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
                    <div style={{ marginTop: '16px' }}>جاري تحميل قائمة المشرفين...</div>
                </div>
            ) : supervisors.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                    {searchTerm ? 'لم يتم العثور على مشرفين مطابقين للبحث' : 'لا يوجد مشرفين في هذا القسم'}
                </div>
            ) : (
                <div style={{ 
                    maxHeight: '300px',
                    overflowY: 'auto',
                    border: `1px solid ${tokens.colorNeutralStroke1}`,
                    borderRadius: '6px'
                }}>
                    {supervisors.map((supervisor) => (
                        <div 
                            key={supervisor.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '12px 16px',
                                borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
                                backgroundColor: selectedSupervisor?.id === supervisor.id 
                                    ? tokens.colorBrandBackground2 
                                    : 'transparent',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                            onClick={() => setSelectedSupervisor(supervisor)}
                        >
                            <Checkbox 
                                checked={selectedSupervisor?.id === supervisor.id}
                                style={{ marginRight: '12px' }}
                            />
                            <Avatar 
                                size={40} 
                                name={supervisor.name}
                                style={{ marginRight: '12px' }}
                            />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{supervisor.name}</div>
                                <div style={{ fontSize: '13px', color: tokens.colorNeutralForeground3 }}>
                                    {supervisor.title} • {supervisor.email}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {/* المشرف المحدد */}
            {selectedSupervisor && (
                <div style={{ 
                    padding: '12px',
                    backgroundColor: tokens.colorBrandBackground2,
                    borderRadius: '6px',
                    border: `1px solid ${tokens.colorBrandStroke1}`
                }}>
                    <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>المشرف المحدد:</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Avatar size={48} name={selectedSupervisor.name} />
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{selectedSupervisor.name}</div>
                            <div style={{ fontSize: '14px', color: tokens.colorNeutralForeground3 }}>
                                {selectedSupervisor.title}
                            </div>
                            <div style={{ fontSize: '13px', color: tokens.colorNeutralForeground3 }}>
                                {selectedSupervisor.email}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}