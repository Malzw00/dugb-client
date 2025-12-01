import { createContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import '../../Styles/HomePad.css';
import SideBar from './SideBar';
import ContentArea from './ContentArea';
import bookimg from  '../../resources/book.png';
import ProjectPad from '../ProjectPad';
import ProfilePad from '../ProfilePad';
import DocumentationPad from '../DocumentationPad/DocumentationPad';
import ProjectManagerPad from '../ControlPad/ControlPad';
import ControlPad from '../ControlPad/ControlPad';



const dbProjects = [
    {
      title: "منصة متابعة",
      description: "منصة مخصصة لطلبة الجامعات لتنظيم المحاضرات، الإعلانات، المناقشات، وربطهم بأعضاء هيئة التدريس.",
      developers: ["محمد سعد", "خالد علي", "خالد محمود"],
      categories: ["منصة تعليمية", "إدارة أكاديمية"],
      keywords: ["تنظيم دراسي", "جامعات", "نظام محاضرات", "مناقشات", "تنبيهات"],
      projImgPath: bookimg,
      major: "علوم الحاسوب",
      collage: "كلية الحاسبات والمعلومات",
      supervisor: "د. فاطمة عبد الرحمن",
      semester: "الفصل الثاني",
      academicYear: "2024-2025"
    },
    {
      title: "نظام حجز مواعيد المستشفى",
      description: "تطبيق يساعد المرضى على حجز المواعيد وتتبع زياراتهم الطبية بسهولة.",
      developers: ["أحمد سالم", "ليلى حسين"],
      categories: ["صحة", "نظام حجز"],
      keywords: ["عيادات", "أطباء", "مواعيد", "تقارير طبية"],
      projImgPath: bookimg,
      major: "نظم معلومات",
      collage: "كلية الحاسبات والمعلومات",
      supervisor: "د. سامي حسن",
      semester: "الفصل الأول",
      academicYear: "2023-2024"
    },
    {
      title: "تطبيق إدارة مهام طلابي",
      description: "تطبيق بسيط لتقسيم المهام اليومية والأكاديمية للطلبة وإدارة الوقت.",
      developers: ["ريم يوسف", "سعيد مراد", "نور الهادي"],
      categories: ["إنتاجية", "تنظيم مهام"],
      keywords: ["مهام", "طلاب", "مذكرات", "تنظيم"],
      projImgPath: bookimg,
      major: "تقنية معلومات",
      collage: "كلية الهندسة",
      supervisor: "د. أماني خالد",
      semester: "الفصل الثاني",
      academicYear: "2024-2025"
    },
    {
      title: "منصة قراءة رقمية",
      description: "منصة لقراءة وتحميل الكتب الرقمية باللغة العربية، موجهة لطلبة المدارس.",
      developers: ["خالد سامي", "ياسمين فاروق"],
      categories: ["تعليم", "كتب إلكترونية"],
      keywords: ["قراءة", "PDF", "طلاب مدارس", "مكتبة رقمية"],
      projImgPath: bookimg,
      major: "تعليم إلكتروني",
      collage: "كلية التربية",
      supervisor: "د. رشا يوسف",
      semester: "الفصل الأول",
      academicYear: "2023-2024"
    },
    {
      title: "نظام إدارة كافيتريا",
      description: "نظام رقمي لإدارة الطلبات والمبيعات في كافيتريا الجامعة.",
      developers: ["هاني عمر", "أميرة علاء"],
      categories: ["خدمات طلابية", "إدارة مبيعات"],
      keywords: ["طلبات", "كاشير", "طلاب", "مبيعات", "قائمة طعام"],
      projImgPath: bookimg,
      major: "هندسة برمجيات",
      collage: "كلية الحاسبات والمعلومات",
      supervisor: "د. وليد عبد الله",
      semester: "الفصل الثاني",
      academicYear: "2024-2025"
    }
];


export const HomePadContext = createContext();

export default function HomePad() {

    const navigate = useNavigate();

    const openProject = (projectId) => navigate(`/home/project/${projectId}`);

    return (
        /**
         * تحصل مشكلة عند عمل ريلود لصفحة 
         * ProjectPad
         * لحل المشكلة سنمرر مصدر البيانات الثابت والذي هو
         * dbProjects
         * لأن الحالة لا تتحدث ولا تتوفر عند عمل ريلود في صفحة
         * ProjectPad
         * إذ ان صفحة 
         * HomePad 
         * لا تتأثر بالريلود.
         */
        <HomePadContext.Provider value={{ openProject, projects: dbProjects }}>
            <Routes>
                {/** home pad route */}
                <Route path="/" element={
                    <div id="home-pad">
                        <SideBar />
                        <ContentArea />
                    </div>
                }/>
                {/** project pad route */}
                <Route path="/project/:projectId" element={<ProjectPad/>}/>
                {/** profile pad route */}
                <Route path="/profile/:userId" element={<ProfilePad/>}/>
                {/** Control pad route */}
                <Route path="/control" element={<ControlPad/>}/>
                {/** project documentation pad route */}
                <Route path="/control/documentation" element={<DocumentationPad/>}/>
            </Routes>
        </HomePadContext.Provider>
    );
}