import { Button, Input, TableCell, TableHeaderCell, TableRow, Tooltip } from "@fluentui/react-components";
import AbstractContentArea from "./AbstractContentArea";
import { useState } from "react";
import { Search20Regular } from "@fluentui/react-icons";



const users = [];


export default function AdminsCA() {

    const [selectedRows, setSelectedRows] = useState([]);
    
    const handleRowClick = (id) => {
        setSelectedRows(prevSelectedRowsArray => {
            return (
                prevSelectedRowsArray.includes(id)? 
                prevSelectedRowsArray.filter(index => index !== id) : 
                [...prevSelectedRowsArray, id]
            );
        });
    };

    const selectAll = () => setSelectedRows(users.map(value => value.userID));
    const unselectAll = () => setSelectedRows([]);
    
    return <AbstractContentArea
        className={'admins-ca'}

        headerChildren={<FilterBox/>}

        toolbarChildren={<ToolBar actions={{selectAll, unselectAll}}/>}

        tableHeaderCells={[
            <TableHeaderCell>معرف المستخدم</TableHeaderCell>,
            <TableHeaderCell>الإسم الأول</TableHeaderCell>,
            <TableHeaderCell>الإسم الأخير</TableHeaderCell>,
            <TableHeaderCell>تاريخ الميلاد</TableHeaderCell>,
            <TableHeaderCell>تاريخ إنشاء الحساب</TableHeaderCell>,
        ]}

        tableRows = {
            users.map(user => 
                <TableRow 
                    key={user.userID} 
                    onClick={() => handleRowClick(user.userID)}
                    style={{
                        backgroundColor: selectedRows.includes(user.projectID) ? "#e0f3ff" : undefined,
                        cursor: "pointer"
                    }}
                >
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.fname}</TableCell>
                    <TableCell>{user.lname}</TableCell>
                    <TableCell>{user.bdate}</TableCell>
                    <TableCell>{user.createdAt}</TableCell>
                </TableRow>
            )
        }
    />
}



function FilterBox() {        
    return <div className="filter-box">
        <Input
            className="search-input" 
            contentBefore={<Search20Regular/>}
            placeholder="بحث عن حساب" 
        />
    </div>
}


function ToolBar({actions}) {

    return <>
        <Button appearance="transparent" className="button">حذف</Button>
        <Tooltip content="منع المستخدم من التفاعل على المنصة، مثل التقييم ومشاركة الآراء." relationship="label">
            <Button appearance="transparent" className="button">حظر</Button>
        </Tooltip>
        <Button appearance="transparent" className="button" onClick={actions.selectAll}>تحديد الكل</Button>
        <Button appearance="transparent" className="button" onClick={actions.unselectAll}>إلغاء التحديد</Button>
    </>
}