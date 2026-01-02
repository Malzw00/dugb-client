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
    const [searchTrigger, setSearchTrigger] = useState(0); // إضافة متغير لتشغيل البحث
    const user = useSelector(state => state.user.value);

    const handleSearch = () => {
        setSearchTrigger(prev => prev + 1); // تشغيل البحث عند النقر على الزر
    };

    useEffect(() => {
        if(user === 'loading' || user === null)
        return null;
    
        setLoading(true);
        
        if (accountTab === 'admins' && !searchText) {
            // Fetch admins
            getAdmins()
                .then(res => {
                    setAccounts(res.data.result ?? []);
                })
                .catch(err => {
                    console.error("Error fetching admins:", err);
                })
                .finally(() => setLoading(false));
        } else {
            // Search for users only when search button is clicked and there's text
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
    }, [accountTab, searchTrigger, user]); // إضافة searchTrigger إلى dependencies

    const handleRoleUpdate = async (accountId, newRole) => {
        try {
            await updateAccountRole({ accountId, role: newRole });
            
            // Update local state
            setAccounts(prev => prev.filter(acc => acc.account_id !== accountId));
            
            // Refresh list
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
            }
            dataContainer={
                loading ? (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '40px',
                    }}>
                        <Spinner label="جاري التحميل..." />
                    </div>
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

function AccountsData({ accounts = [], accountTab, onRoleUpdate }) {
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [permissionsOpen, setPermissionsOpen] = useState(false);
    const [permissionsLoading, setPermissionsLoading] = useState(false);
    const [accountPermissions, setAccountPermissions] = useState([]);
    
    // تعريف الصلاحيات الثابتة حسب seedPermissions
    const allPermissions = [
        { 
            id: 'projects', 
            name: 'إدارة المشاريع', 
            description: 'القدرة على إدارة المشاريع وتبعياتها',
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
            id: 'collages', 
            name: 'إدارة الكليات', 
            description: 'إدارة الكليات والأقسام الأكاديمية',
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

    // تجميع الصلاحيات حسب الفئة
    const groupedPermissions = allPermissions.reduce((acc, permission) => {
        if (!acc[permission.category]) {
            acc[permission.category] = [];
        }
        acc[permission.category].push(permission);
        return acc;
    }, {});

    const loadAccountPermissions = async (accountId) => {
        setPermissionsLoading(true);
        try {
            const res = await getAccountPermissions(accountId);
            // تحويل المصفوفة من الخادم إلى مصفوفة من معرفات الصلاحيات
            const permissions = res.data.result?.map(p => p.permission_id) || [];
            setAccountPermissions(permissions);
        } catch (error) {
            console.error("Error loading permissions:", error);
            alert("فشل في تحميل الصلاحيات");
        } finally {
            setPermissionsLoading(false);
        }
    };

    const handleOpenPermissions = (account) => {
        setSelectedAccount(account);
        loadAccountPermissions(account.account_id);
        setPermissionsOpen(true);
    };

    const handlePermissionToggle = async (permissionId, granted) => {
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
        }
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

    return (
        <div>
            {/* Permissions Dialog */}
            <Dialog open={permissionsOpen} onOpenChange={(_, data) => setPermissionsOpen(data.open)}>
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
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '20px',
                                    marginTop: '10px'
                                }}>
                                    {Object.entries(groupedPermissions).map(([category, perms]) => (
                                        <div key={category}>
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
                                                {perms.map(permission => {
                                                    const hasPermission = accountPermissions.includes(permission.id);
                                                    return (
                                                        <div key={permission.id} style={{
                                                            display: 'flex',
                                                            alignItems: 'flex-start',
                                                            padding: '12px',
                                                            border: '1px solid #e1dfdd',
                                                            borderRadius: '4px',
                                                            backgroundColor: hasPermission ? '#f3f2f1' : 'transparent',
                                                            transition: 'all 0.2s'
                                                        }}>
                                                            <Checkbox
                                                                checked={hasPermission}
                                                                onChange={(_, data) => 
                                                                    handlePermissionToggle(permission.id, data.checked)
                                                                }
                                                                style={{ marginTop: '2px' }}
                                                            />
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
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button 
                                appearance="secondary" 
                                onClick={() => setPermissionsOpen(false)}
                            >
                                إغلاق
                            </Button>
                            <Button 
                                appearance="primary"
                                onClick={() => {
                                    // يمكن إضافة زر لحفظ التغييرات إذا لزم الأمر
                                    setPermissionsOpen(false);
                                }}
                            >
                                حفظ التغييرات
                            </Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>

            {/* Accounts List */}
            {accounts.length === 0 ? (
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
            ) : (
                accounts.map((account, index) => (
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
                ))
            )}
        </div>
    );
}