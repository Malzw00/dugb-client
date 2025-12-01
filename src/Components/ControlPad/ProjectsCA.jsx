import { Button, Dropdown, Input, TableCell, Option, TableHeaderCell, TableRow } from "@fluentui/react-components";
import AbstractContentArea from "./AbstractContentArea";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Search20Regular } from "@fluentui/react-icons";

const projects = [
    {
        projectID: 1,
        title: "نظام إدارة المكتبة الذكي",
        date: "2025-05-01",
        semester: "الفصل الثاني",
        department: "علوم الحاسوب",
        faculty: "كلية الحاسبات والمعلومات"
    },
    {
        projectID: 2,
        title: "تطبيق توصيل طلبات محلي",
        date: "2025-04-20",
        semester: "الفصل الأول",
        department: "نظم المعلومات",
        faculty: "كلية التجارة"
    },
    {
        projectID: 3,
        title: "منصة للتعليم الإلكتروني",
        date: "2025-03-15",
        semester: "الفصل الثاني",
        department: "تقنية المعلومات",
        faculty: "كلية الهندسة"
    },
    {
        projectID: 4,
        title: "تحليل بيانات الطقس باستخدام الذكاء الاصطناعي",
        date: "2025-02-10",
        semester: "الفصل الأول",
        department: "علوم البيانات",
        faculty: "كلية العلوم"
    },
    {
        projectID: 5,
        title: "نظام متابعة مشاريع التخرج",
        date: "2025-01-25",
        semester: "الفصل الثاني",
        department: "هندسة البرمجيات",
        faculty: "كلية الحاسبات والمعلومات"
    }
];



export default function ProjectsCA() {
  
    const [selectedRows, setSelectedRows] = useState([]);
    
    const handleRowClick = (id) => {
        setSelectedRows(prev => {
            return (
                prev.includes(id)? 
                prev.filter(index => index !== id) : 
                [...prev, id]
            );
        });
    };

    const selectAll = () => setSelectedRows(projects.map(value => value.projectID));
    const unselectAll = () => setSelectedRows([]);

    return <AbstractContentArea

        className={'project-ca'}

        headerChildren={<FilterBox/>}

        toolbarChildren = {<ToolBar actions={{selectAll, unselectAll}}/>}

        tableHeaderCells={
            [
                <TableHeaderCell>المعرف</TableHeaderCell>,
                <TableHeaderCell>العنوان</TableHeaderCell>,
                <TableHeaderCell>التاريخ</TableHeaderCell>,
                <TableHeaderCell>الفصل</TableHeaderCell>,
                <TableHeaderCell>القسم</TableHeaderCell>,
                <TableHeaderCell>الكلية</TableHeaderCell>
            ]
        }

        tableRows = {
            projects.map(val => 
                <TableRow 
                    key={val.projectID} 
                    onClick={() => handleRowClick(val.projectID)}
                    style={{
                        backgroundColor: selectedRows.includes(val.projectID) ? "#e0f3ff" : undefined,
                        cursor: "pointer"
                    }}
                >
                    <TableCell>{val.projectID}</TableCell>
                    <TableCell>{val.title}</TableCell>
                    <TableCell>{val.department}</TableCell>
                    <TableCell>{val.faculty}</TableCell>
                    <TableCell>{val.semester}</TableCell>
                    <TableCell>{val.date}</TableCell>
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
            placeholder="بحث عن مشروع" 
        />

        <Dropdown placeholder="حدد الفئات" multiselect className="dropdown filter-input">
            <Option>حاسب</Option>
            <Option>إلكترونيات</Option>
            <Option>طاقة</Option>
        </Dropdown>

        <Dropdown placeholder="التخصص" multiselect className="dropdown filter-input">
            <Option>ذكاء اصطناعي</Option>
            <Option>روبوتات</Option>
            <Option>طاقة متجددة</Option>
        </Dropdown>
        
        <Dropdown placeholder="الفصل" multiselect className="dropdown filter-input">
            <Option>الفصل الأول 2024</Option>
            <Option>الفصل الثاني 2024</Option>
            <Option>الفصل الأول 2025</Option>
        </Dropdown>
    </div>
}


function ToolBar({actions}) {
    
    const navigate = useNavigate();

    return <>
        <Button appearance="primary" className="button" onClick={()=>navigate('/home/control/documentation')}>
            توثيق مشروع
        </Button>
        <Button appearance="transparent" className="button">حذف</Button>
        <Button appearance="transparent" className="button">تعديل</Button>
        <Button appearance="transparent" className="button" onClick={actions.selectAll}>تحديد الكل</Button>
        <Button appearance="transparent" className="button" onClick={actions.unselectAll}>إلغاء التحديد</Button>
    </>
}