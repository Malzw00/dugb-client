import { 
    Button,
    tokens,
    Rating,
    Badge,
    Link,
    Spinner
} from "@fluentui/react-components";
import {
    Calendar24Regular,
    Heart24Regular,
    Heart24Filled,
    Star24Regular,
    People24Regular,
    Link24Regular,
    Grid24Regular,
    Star24Filled,
    List24Regular,
    Book24Regular,
    Bookmark24Regular,
    ArrowDownload16Regular,
    ArrowDownload20Regular,
    Book20Regular,
    Calendar20Regular
} from "@fluentui/react-icons";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProjectById } from "@services/project/project";
import { useDispatch, useSelector } from "react-redux";
import { selectHeaderTab } from "@slices/selectedHeaderTab.slice";
import { selectCategory } from "@slices/selectedCategory.slice";
import { selectCollage } from "@slices/selectedCollage.slice";
import { setPerson } from "@slices/person.slice";
import { selectPeopleTab } from "@slices/selectedPeopleTab.slice";
import Loading from "@PreMadeComponents/Loading";
import projectIcon from '@resources/book.svg';
import { addProjectLike, amILikeProject, getMyProjectRating, getProjectLikesCount, getProjectRatingAverage, rateProject } from "../services/project/social";
import baseURL from "@config/baseURL.config";
import Header from "./HomePad/Header";
import '@styles/ProjectPad.css';
import CommentsSection from "./CommentsSection";

// كائن تخطيط لأنواع المستخدمين
const PERSON_TYPE_CONFIG = {
    student: {
        peopleTab: 'students',
        idField: 'student_id',
        displayName: (person) => person.student_full_name
    },
    supervisor: {
        peopleTab: 'supervisors',
        idField: 'supervisor_id',
        displayName: (person) => `${person.supervisor_title || ''} . ${person.supervisor_full_name}`.trim()
    }
};


const ProjectHeaderSection = ({ project }) => {

    const user = useSelector(state => state.user.value)
    const [myLike, setMyLike] = useState(false);
    const [currentLikes, setCurrentLikes] = useState(0);
    const [rating, setRating] = useState(0);
    const [myRating, setMyRating] = useState(0);
    const [loadingLike, setLoadingLike] = useState(false);
    const [loadingRating, setLoadingRating] = useState(false);

    useEffect(() => {
        if(!user?.accessToken)
        return;

        amILikeProject(project.project_id)
            .then(res => {
                setMyLike(res.data?.result || false)
            })
            .catch(err => {
                console.log(err);
            })
        
        getMyProjectRating(project.project_id)
            .then(res => {
                setMyRating(res.data?.result || false)
            })
            .catch(err => {
                console.log(err);
            })

    }, [user, myRating, myLike]);

    useEffect(() => {
        getProjectLikesCount(project.project_id)
            .then(res => {
                setCurrentLikes(res.data?.result || 0)
            })
            .catch(err => {
                console.log(err);
            });

        getProjectRatingAverage(project.project_id)
            .then(res => {
                const result = res.data?.result || {};
                setRating({
                    rate: result.rating,
                    total: result.total_ratings,
                });
            })
            .catch(err => {
                console.log(err);
            })
    }, [myLike, myRating]);

    const handleLike = useCallback(() => {
        setLoadingLike(true)
        addProjectLike(project.project_id)
            .then(res => {
                const result = res.data?.result || false;
                setMyLike(result.hasLike);
            })
            .catch(err => {
                console.log(err)
            })
            .finally(_ => {
                setLoadingLike(false);
            });
    }, []);

    const handleRatingChange = useCallback((e) => {
        setLoadingRating(true);
        rateProject({ projectId: project.project_id, rate: e.target.value })
            .then(res => {
                const result = res.data?.result;
                setMyRating(result || 0);
            })
            .catch(err => {
                console.log(err)
            })
            .finally(_ => {
                setLoadingRating(false);
            });
    }, []);

    return (
        <header className="project-header">
            <div className="project-title-area">
                <div className="project-icon">
                    <img src={projectIcon} style={{ width: '80px', height: '80px' }}></img>
                </div>
                <div className="project-title-content">
                    <h1 style={{ userSelect: 'text' }}>{project.project_title || 'عنوان المشروع'}</h1>
                    <p className="project-update-date">
                        آخر تحديث: {project.updatedAt ? new Date(project.updatedAt).toISOString().slice(0, 10) : '2023-10-25'}
                    </p>
                    <div className="badge-group">
                        <div className="rating-container flex-row justify-center" style={{ width: '120px' }}>
                            {loadingRating && <Spinner size="tiny"/> || <Rating 
                                value={myRating} 
                                aria-label="تقييم المشروع"
                                size="large"
                                color='marigold'
                                onChange={handleRatingChange}
                            />}
                        </div>
                    </div>
                </div>
            </div>
            <div className="project-header-right">
                <div className="project-stats">
                    <div className="stat-item">
                        {rating?.rate > 0 && <Star24Filled className='stat-icon'/> || <Star24Regular className='star-icon'/>}
                        <span>{rating.rate}/5</span>
                        <span>({rating.total})</span>
                    </div>
                    <div className="stat-item">
                        <Button
                            size="small"
                            appearance="subtle"
                            icon={
                                loadingLike && <Spinner size="tiny"/> || (myLike 
                                ? <Heart24Filled color="red" /> 
                                : <Heart24Regular />)
                            }
                            onClick={handleLike}
                            className="like-button"
                        >
                            {currentLikes} إعجاب
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
};

const ProjectDescriptionSection = ({ project }) => {
    
    const keywordPills = useMemo(() => {
        if (!project.Keywords?.length) {
            return (
                <div className="empty-state">
                    لم يتم تحديد الكلمات المفتاحية بعد
                </div>
            );
        }

        return project.Keywords.map((keyword) => (
            <div key={keyword.keyword} style={{
                borderRadius: '5px',
                background: tokens.colorNeutralBackground3,
                padding: '0px 8px',
                border: `1px solid ${tokens.colorNeutralStroke1}`
            }}>
                <Link href={`/home/search/projects?keyword=${keyword.keyword}`}>
                    {keyword.keyword}
                </Link>
            </div>
        ));
    }, [project.Keywords]);

    return (
        <section className="project-card2 description-card">
            <div className="card-title">
                <List24Regular />
                <span>وصف المشروع</span>
            </div>
            <div className="project-description" style={{ userSelect: 'text' }}>
                {project.project_description || <span className='empty-state'>'لا يوجد وصف للمشروع.'</span>}
            </div>
            <div className="keywords-section">
                <div className="section-label">الكلمات المفتاحية</div>
                <div className="pill-container">
                    {keywordPills}
                </div>
            </div>
        </section>
    );
};

const ReferencesSection = ({ project }) => (
    <section className="project-card2">
        <div className="card-title">
            <Link24Regular />
            <span>المراجع</span>
        </div>
        <ul className="info-list">
            {project?.References?.map(ref => {
                return (
                    ref.reference_link 
                    && <Link key={ref.reference_id} href={ref.reference_link}>
                        {ref.reference_title} 
                        {ref.reference_author? ' - ' + ref.reference_author: ''}
                    </Link>
                    || <span key={ref.reference_id}>
                        {ref.reference_title} 
                        {ref.reference_author? ' - ' + ref.reference_author: ''}
                    </span>
                )
            })}
            {!project?.References?.length && <span className="empty-state">لم يتم إرفاق المراجع</span>}
        </ul>
    </section>
);

const CategoriesSection = ({ project }) => {
    
    return (
        <section className="project-card2">
            <div className="card-title">
                <Grid24Regular />
                <span>الفئات</span>
            </div>
            <ul className="pill-container">
                {project?.Categories?.map((category) => (
                    <div key={category.category_id} style={{
                        borderRadius: '5px',
                        background: tokens.colorNeutralBackground3,
                        padding: '0px 8px',
                        border: `1px solid ${tokens.colorNeutralStroke1}`
                    }}>
                        <Link href={`/home/categories/${category.category_id}?projectId=${project.project_id}`}>
                            {category.category_name}
                        </Link>
                    </div>
                ))}
                {project?.Categories?.length < 1 && <span className='empty-state'>لم يتم تحديد أي فئة بعد</span>}
            </ul>
        </section>
    )
};

const FilesSection = ({ book, presentation }) => (
    <section className="project-card2">
        <div className="card-title">
            <Book24Regular />
            <span>ملفات المشروع</span>
        </div>
        
        <div className="action-buttons">
            
            {book ? (
                <a
                    href={`${baseURL}/${book.path}/${book.stored_name}`}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}
                >
                    <Button 
                        style={{ justifyContent: 'space-between' }}
                        appearance="primary" 
                        size="medium" 
                        className="action-btn">

                        <Book20Regular/>
                        كتاب المشروع
                        <Book20Regular color="transparent"/>
                    </Button>
                </a>
            ) : (
                <div className="empty-state">
                    لم يتم رفع الكتاب بعد
                </div>
            )}
            
            {presentation ? (
                <a
                    href={`${baseURL}/${presentation.path}/${presentation.stored_name}`}
                    download
                    style={{ textDecoration: "none" }}
                >
                    <Button
                        style={{ justifyContent: 'space-between', background: tokens.colorPaletteRedBackground3 }}
                        appearance="primary"
                        size="medium"
                        className="action-btn">
                        
                        <Calendar20Regular/>
                        العرض التقديمي
                        <Calendar20Regular color="transparent"/>
                    </Button>
                </a>
            ) : (
                <div className="empty-state">
                    لم يتم رفع العرض التقديمي بعد
                </div>
            )}
        </div>
    </section>
);

const TeamSection = ({ project, onPersonClick }) => {
    
    const supervisorDisplayName = useMemo(() => {
        return project.Supervisor ? 
            PERSON_TYPE_CONFIG.supervisor.displayName(project.Supervisor) : 
            (<span className="empty-state">لم يتم إرفاق بيانات المشرف بعد</span>);
    }, [project.Supervisor]);

    // const studentsDisplay = useMemo(() => {
    //     return project.Students?.map(s => s.student_full_name).join('، ') || 'غير محدد';
    // }, [project.Students]);

    return (
        <section className="project-card2">
            <div className="card-title">
                <People24Regular />
                <span>الفريق</span>
            </div>
            <ul className="info-list">
                <li>
                    <span className="info-label">المشرف</span>
                    <span 
                        className=" clickable"
                        onClick={project.Supervisor ? onPersonClick(project.Supervisor, 'supervisor') : undefined}
                    >
                        {supervisorDisplayName}
                    </span>
                </li>
                <li>
                    <span className="info-label">الطلاب</span>
                    <div className="students-list">
                        {project.Students?.map((student, index) => (
                            <span 
                                key={index}
                                className="student-name clickable"
                                onClick={onPersonClick(student, 'student')}
                            >
                                {student.student_full_name}
                            </span>
                        ))}
                        {project.Students?.length < 1 && <span className="empty-state">لم يتم إرفاق بيانات الطلبة بعد</span>}
                    </div>
                </li>
            </ul>
        </section>
    );
};

const AcademicInfoSection = ({ project }) => {
    const semesterText = useMemo(() => {
        if (!project.project_semester) return '';
        const semesterLower = project.project_semester.toLowerCase();
        return semesterLower === 'spring' ? 'الربيع' : 
               semesterLower === 'autumn' ? 'الخريف' : 
               project.project_semester;
    }, [project.project_semester]);

    const yearText = useMemo(() => {
        return project.project_date ? new Date(project.project_date).getFullYear() : '';
    }, [project.project_date]);

    return (
        <section className="project-card2" style={{marginBottom:'21px'}}>
            <div className="card-title">
                <Bookmark24Regular />
                <span>معلومات الأكاديمية</span>
            </div>
            <ul className="info-list">
                <li>
                    <span className="info-label">الكلية</span>
                    <span className="info-value">
                        {project.Department?.Collage?.collage_name || 'غير محدد'}
                    </span>
                </li>
                <li>
                    <span className="info-label">القسم</span>
                    <span className="info-value">
                        {project.Department?.department_name || 'غير محدد'}
                    </span>
                </li>
                <li>
                    <div className="academic-semester">
                        <Calendar24Regular className="academic-icon" />
                        <span className="academic-text">
                            {yearText} - فصل {semesterText}
                        </span>
                    </div>
                </li>
            </ul>
        </section>
    );
};

// المكون الرئيسي
export default function ProjectPad() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProject = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await getProjectById(projectId);
            
            if (response?.data?.success && response.data.result) {
                setProject(response.data.result);
            } else {
                setError('تعذر تحميل بيانات المشروع');
            }
        } catch (err) {
            console.error('خطأ في جلب بيانات المشروع:', err);
            setError('حدث خطأ أثناء تحميل البيانات');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProject();

    }, [projectId]);

    const handleBackClick = useCallback(() => {
        navigate('/home');
    }, [navigate]);

    const handlePersonClick = useCallback((person, type) => {
        return () => {
            const config = PERSON_TYPE_CONFIG[type];
            dispatch(selectPeopleTab(config.peopleTab));
            dispatch(setPerson(person[config.idField]));
        };
    }, [dispatch]);

    if (loading) {
        return (
            <Loading 
                text="جار تحميل بيانات المشروع" 
                vertical 
                full={true} 
                size="extra-large"
                style={{ background: tokens.colorNeutralBackground3 }}
            />
        );
    }

    if (error || !project) {
        return (
            <div className="project-error-container">
                <div className="project-error-content">
                    <h2>{error || 'المشروع غير موجود'}</h2>
                    <Button appearance="primary" onClick={fetchProject}>
                        تحديث
                    </Button>
                    <Button appearance="secondary" onClick={() => navigate('/home')}>
                        العودة إلى الصفحة الرئيسية
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="project-display-container">
            <Header
                disableTabs
                onBackClick={handleBackClick}
            />

            <div className="project-main-container">
                <ProjectHeaderSection 
                    project={project}
                />

                <div className="project-grid-layout">
                    <main className="project-main-content">
                        <ProjectDescriptionSection 
                            project={project}
                        />
                        <CategoriesSection project={project}/>
                        <ReferencesSection project={project}/>
                        <CommentsSection project={project}/>
                    </main>

                    <aside className="project-sidebar">
                        <FilesSection book={project.Book} presentation={project.Presentation}/>
                        <TeamSection 
                            project={project}
                            onPersonClick={handlePersonClick}
                        />
                        <AcademicInfoSection project={project} />
                        
                    </aside>
                </div>
            </div>
        </div>
    );
}