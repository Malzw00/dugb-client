import { useEffect, useState } from "react";
import ControlArea, { Row } from "./ControlArea";
import { 
    Input, 
    Tab, 
    TabList, 
    Button,
    Dialog,
    DialogSurface,
    DialogTitle,
    DialogBody,
    DialogActions,
    DialogContent,
    Checkbox,
    Spinner,
    Text,
    Badge,
    Tooltip
} from "@fluentui/react-components";
import { 
    Search16Regular, 
    Delete16Regular, 
    Shield16Regular,
    ArrowUp16Regular,
    Info16Regular
} from "@fluentui/react-icons";
import { getAdmins, updateAccountRole, getAccountPermissions, grantPermission, removePermission } from "@root/src/services/admin";
import { searchAccounts } from "@root/src/services/account";
import { useSelector } from "react-redux";

export default function Accounts() {
    const [accounts, setAccounts] = useState([]);
    const [accountTab, setAccountTab] = useState('admins');
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchTrigger, setSearchTrigger] = useState(0);
    const user = useSelector(state => state.user.value);

    const handleSearch = () => {
        setSearchTrigger(prev => prev + 1);
    };

    useEffect(() => {
        if(!user?.accessToken)
        return;

        setLoading(true);
        
        if (accountTab === 'admins' && !searchText) {
            getAdmins()
                .then(res => {
                    setAccounts(res.data.result ?? []);
                })
                .catch(err => {
                    console.error("Error fetching admins:", err);
                })
                .finally(() => setLoading(false));
        } else {
            if (searchText.trim()) {
                searchAccounts({
                    keyword: searchText,
                    role: accountTab === 'users'? 'user': 'admin',
                    limit: 50
                })
                    .then(res => {
                        setAccounts(res.data.result ?? []);
                    })
                    .catch(err => {
                        console.error("Error searching users:", err);
                    })
                    .finally(() => setLoading(false));
            } else {
                setAccounts([]);
                setLoading(false);
            }
        }
    }, [accountTab, searchTrigger, user]);

    const handleRoleUpdate = async (accountId, newRole) => {
        try {
            await updateAccountRole({ accountId, role: newRole });
            
            setAccounts(prev => prev.filter(acc => acc.account_id !== accountId));
            
            if (accountTab === 'admins') {
                const res = await getAdmins();
                setAccounts(res.data.result ?? []);
            }
        } catch (error) {
            console.error("Error updating role:", error);
            alert("فشل في تحديث الدور");
        }
    };

    return (
        <ControlArea
            title={'إدارة الحسابات'}
            toolbar={
                <AccountsToolbar
                    searchText={searchText}
                    setSearchText={setSearchText}
                    accountTab={accountTab}
                    setAccountTab={setAccountTab}
                    loading={loading}
                    handleSearch={handleSearch}
                    setAccounts={setAccounts}
                />
            }
            dataContainer={
                loading ? (
                    <LoadingSpinner />
                ) : (
                    <AccountsData 
                        accounts={accounts}
                        accountTab={accountTab}
                        onRoleUpdate={handleRoleUpdate}
                    />
                )
            }
        />
    );
}

// ==================== مكونات فرعية ====================

function AccountsToolbar({ 
    searchText, 
    setSearchText, 
    accountTab, 
    setAccountTab, 
    loading, 
    handleSearch,
    setAccounts 
}) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            width: '100%',
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
            }}>
                <Input 
                    type="search" 
                    contentBefore={<Search16Regular />}
                    placeholder="ابحث عن مستخدم..."
                    style={{ width: '350px' }}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    disabled={loading}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                />
                <Button 
                    appearance="primary" 
                    icon={<Search16Regular />}
                    onClick={handleSearch}
                    disabled={loading || (!searchText.trim() && accountTab === 'users')}
                >
                    بحث
                </Button>
            </div>

            <TabList 
                selectedValue={accountTab} 
                onTabSelect={(_, data) => {
                    setAccountTab(data.value);
                    setSearchText('');
                    setAccounts([]);
                }} 
                style={{ padding: '0' }}
                disabled={loading}
            >
                <Tab value={'admins'}>المسؤولين</Tab>
                <Tab value={'users'}>المستخدمين</Tab>
            </TabList>
        </div>
    );
}

function LoadingSpinner() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
        }}>
            <Spinner label="جاري التحميل..." />
        </div>
    );
}

function EmptyState({ accountTab, accounts }) {
    return (
        <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#605e5c'
        }}>
            {accountTab === 'users' && !accounts.length ? (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <Search16Regular style={{ fontSize: '48px', color: '#c8c6c4' }} />
                    <Text>اكتب في مربع البحث وانقر على زر البحث للعثور على المستخدمين</Text>
                </div>
            ) : (
                <Text>لا توجد حسابات للعرض</Text>
            )}
        </div>
    );
}

function AccountsData({ accounts = [], accountTab, onRoleUpdate }) {
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [permissionsOpen, setPermissionsOpen] = useState(false);
    
    const handleOpenPermissions = (account) => {
        setSelectedAccount(account);
        setPermissionsOpen(true);
    };

    const handleRemoveAdmin = async (accountId) => {
        if (window.confirm("هل أنت متأكد من إزالة صلاحية المسؤول؟")) {
            await onRoleUpdate(accountId, 'user');
        }
    };

    const handlePromoteToAdmin = async (accountId) => {
        if (window.confirm("هل تريد ترقية هذا المستخدم إلى مسؤول؟")) {
            await onRoleUpdate(accountId, 'admin');
        }
    };

    if (accounts.length === 0) {
        return <EmptyState accountTab={accountTab} accounts={accounts} />;
    }

    return (
        <div>
            <PermissionsDialog 
                isOpen={permissionsOpen}
                onOpenChange={setPermissionsOpen}
                selectedAccount={selectedAccount}
            />
            
            {accounts.map((account, index) => (
                <Row
                    key={account.account_id}
                    index={index + 1}
                    name={`${account.fst_name} ${account.lst_name}`}
                    extraCells={[
                        {
                            content: (
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '4px'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        <span>{account.account_email}</span>
                                        {accountTab === 'admins' && (
                                            <Badge appearance="filled" color="brand" size="small">
                                                مسؤول
                                            </Badge>
                                        )}
                                    </div>
                                    {account.account_phone && (
                                        <Text size={200} style={{ color: '#605e5c' }}>
                                            {account.account_phone}
                                        </Text>
                                    )}
                                </div>
                            )
                        }
                    ]}
                    actions={
                        accountTab === 'admins' ? [
                            {
                                content: (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        <Shield16Regular />
                                        الصلاحيات
                                    </div>
                                ),
                                onClick: () => handleOpenPermissions(account)
                            },
                            {
                                content: (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        color: '#d13438'
                                    }}>
                                        <Delete16Regular />
                                        إزالة المسؤول
                                    </div>
                                ),
                                onClick: () => handleRemoveAdmin(account.account_id)
                            }
                        ] : [
                            {
                                content: (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        color: '#107c10'
                                    }}>
                                        <ArrowUp16Regular />
                                        ترقية لمسؤول
                                    </div>
                                ),
                                onClick: () => handlePromoteToAdmin(account.account_id)
                            }
                        ]
                    }
                />
            ))}
        </div>
    );
}

function PermissionsDialog({ isOpen, onOpenChange, selectedAccount }) {
    const [permissionsLoading, setPermissionsLoading] = useState(false);
    const [accountPermissions, setAccountPermissions] = useState([]);
    const [updatingPermission, setUpdatingPermission] = useState(null); // جديد: لتتبع الصلاحية التي يتم تحديثها
    
    const allPermissions = [
        { 
            id: 'projects', 
            name: 'إدارة المشاريع', 
            description: 'القدرة على إدارة المشاريع وتبعياتها',
        },
        { 
            id: 'collages', 
            name: 'إدارة الكليات', 
            description: 'إدارة الكليات والأقسام الأكاديمية',
        },
        { 
            id: 'categories', 
            name: 'إدارة الفئات', 
            description: 'القدرة على إدارة الفئات وتصنيفات المشاريع',
        },
        { 
            id: 'people', 
            name: 'إدارة الأشخاص', 
            description: 'إدارة الطلبة والمشرفين والمستخدمين',
        },
        { 
            id: 'files', 
            name: 'إدارة الملفات', 
            description: 'إدارة الصور والكتب والعروض التقديمية والمراجع',
        },
        { 
            id: 'delete_comment', 
            name: 'حذف التعليقات', 
            description: 'القدرة على حذف تعليقات المستخدمين',
        },
    ];

    const loadAccountPermissions = async (accountId) => {
        setPermissionsLoading(true);
        try {
            const res = await getAccountPermissions(accountId);
            const permissions = res.data.result?.map(p => p.permission_id) || [];
            setAccountPermissions(permissions);
        } catch (error) {
            console.error("Error loading permissions:", error);
            alert("فشل في تحميل الصلاحيات");
        } finally {
            setPermissionsLoading(false);
        }
    };

    const handlePermissionToggle = async (permissionId, granted) => {
        setUpdatingPermission(permissionId); // بدء التحميل لهذه الصلاحية
        
        try {
            if (granted) {
                await grantPermission({ 
                    accountId: selectedAccount.account_id, 
                    permissionId 
                });
                setAccountPermissions(prev => [...prev, permissionId]);
            } else {
                await removePermission({ 
                    accountId: selectedAccount.account_id, 
                    permissionId 
                });
                setAccountPermissions(prev => 
                    prev.filter(id => id !== permissionId)
                );
            }
        } catch (error) {
            console.error("Error updating permission:", error);
            alert("فشل في تحديث الصلاحية");
        } finally {
            setUpdatingPermission(null); // إنهاء التحميل
        }
    };

    useEffect(() => {
        if (isOpen && selectedAccount) {
            loadAccountPermissions(selectedAccount.account_id);
        }
    }, [isOpen, selectedAccount]);

    return (
        <Dialog open={isOpen} onOpenChange={(_, data) => onOpenChange(data.open)}>
            <DialogSurface style={{ minWidth: '500px' }}>
                <DialogBody>
                    <DialogTitle>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <span>
                                صلاحيات المسؤول: {selectedAccount?.fst_name} {selectedAccount?.lst_name}
                            </span>
                            <Badge appearance="filled" color="brand" size="small">
                                {accountPermissions.length} / {allPermissions.length}
                            </Badge>
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        {permissionsLoading ? (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                padding: '40px'
                            }}>
                                <Spinner label="جاري تحميل الصلاحيات..." />
                            </div>
                        ) : (
                            <PermissionsList 
                                permissions={allPermissions}
                                accountPermissions={accountPermissions}
                                updatingPermission={updatingPermission}
                                onPermissionToggle={handlePermissionToggle}
                            />
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button 
                            appearance="secondary" 
                            onClick={() => onOpenChange(false)}
                        >
                            إغلاق
                        </Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
}

function PermissionsList({ permissions, accountPermissions, updatingPermission, onPermissionToggle }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            marginTop: '10px'
        }}>
            <div>
                <Text weight="semibold" style={{
                    display: 'block',
                    marginBottom: '10px',
                    paddingBottom: '5px',
                    borderBottom: '2px solid #0078d4',
                    color: '#0078d4'
                }}>
                    صلاحيات النظام
                </Text>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                }}>
                    {permissions.map(permission => {
                        const hasPermission = accountPermissions.includes(permission.id);
                        const isUpdating = updatingPermission === permission.id;
                        
                        return (
                            <PermissionItem 
                                key={permission.id}
                                permission={permission}
                                hasPermission={hasPermission}
                                isUpdating={isUpdating}
                                onToggle={(checked) => onPermissionToggle(permission.id, checked)}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function PermissionItem({ permission, hasPermission, isUpdating, onToggle }) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            padding: '12px',
            border: '1px solid #e1dfdd',
            borderRadius: '4px',
            backgroundColor: hasPermission ? '#f3f2f1' : 'transparent',
            transition: 'all 0.2s',
            opacity: isUpdating ? 0.7 : 1
        }}>
            <div style={{ position: 'relative', marginTop: '2px' }}>
                <Checkbox
                    checked={hasPermission}
                    onChange={(_, data) => onToggle(data.checked)}
                    disabled={isUpdating}
                />
                {isUpdating && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none'
                    }}>
                        <Spinner size="tiny" />
                    </div>
                )}
            </div>
            <div style={{ 
                marginRight: '12px',
                flex: 1
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                }}>
                    <Text weight="semibold">{permission.name}</Text>
                    <Tooltip
                        content={permission.description}
                        relationship="label"
                    >
                        <Info16Regular style={{ 
                            fontSize: '14px',
                            color: '#605e5c',
                            cursor: 'help'
                        }} />
                    </Tooltip>
                </div>
                <Text size={200} style={{ 
                    color: '#605e5c',
                    marginTop: '2px'
                }}>
                    {permission.description}
                </Text>
            </div>
        </div>
    );
}