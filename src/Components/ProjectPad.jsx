import { 
    Button,
    tokens,
    Rating,
    Badge,
    Link
} from "@fluentui/react-components";
import {
    ArrowDown24Regular,
    Calendar24Regular,
    Heart24Regular,
    Heart24Filled,
    Star24Regular,
    People24Regular,
    Building24Regular,
    Link24Regular,
    Comment24Regular,
    Grid24Regular,
    Book48Color,
    BookOpen24Regular
} from "@fluentui/react-icons";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PlatformHeader from "@components/PreMadeComponents/PlatformHeader";
import { getProjectById } from "@services/project/project";
import { useDispatch, useSelector } from "react-redux";
import { selectHeaderTab } from "@slices/selectedHeaderTab.slice";
import { selectCategory } from "@slices/selectedCategory.slice";
import { selectCollage } from "@slices/selectedCollage.slice";
import { setPerson } from "../store/slices/person.slice";
import { selectPeopleTab } from "../store/slices/selectedPeopleTab.slice";
import Loading from "./PreMadeComponents/Loading";
import '@styles/ProjectPad.css';
import projectIcon from '@resources/book.svg';
import { addProjectLike, amILikeProject, getMyProjectRating, getProjectLikesCount, rateProject } from "../services/project/social";

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

// مكونات فرعية
const ProjectHeaderSection = ({ project }) => {

    const user = useSelector(state => state.user.value)
    const [myLike, setMyLike] = useState(false);
    const [currentLikes, setCurrentLikes] = useState(0);
    const [rating, setRating] = useState(0);
    const [myRating, setMyRating] = useState(0);

    useEffect(() => {
        if(user === 'loading' || !user) 
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
            })
    }, [myLike, myRating ]);

    const handleLike = useCallback(() => {
        addProjectLike(project.project_id)
            .then(res => {
                const result = res.data?.result || false;
                setMyLike(result.hasLike);
            })
            .catch(err => {
                console.log(err)
            });
    }, []);

    const handleRatingChange = useCallback((e) => {
        
        rateProject({ projectId: project.project_id, rate: e.target.value })
            .then(res => {
                const result = res.data?.result;
                setMyRating(result || 0);
            })
            .catch(err => {
                console.log(err)
            });
    }, []);


    return (
        <header className="project-header">
            <div className="project-title-area">
                <div className="project-icon">
                    {/* <Book48Color style={{ width: '89px', height: '89px' }}/> */}
                    <img src={projectIcon} style={{ width: '80px', height: '80px' }}></img>
                </div>
                <div className="project-title-content">
                    <h1>{project.project_title || 'عنوان المشروع'}</h1>

                    <div className="badge-group">
                        <div className="rating-container">
                            <Rating 
                                value={myRating} 
                                aria-label="تقييم المشروع"
                                size="large"
                                color='marigold'
                                onChange={handleRatingChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="project-header-right">
                <div className="project-stats">
                    <div className="stat-item">
                        <Star24Regular className="stat-icon" />
                        <span>{rating.toFixed(1)}/5</span>
                    </div>
                    <div className="stat-item">
                        <Button
                            size="small"
                            appearance="subtle"
                            icon={myLike ? <Heart24Filled color="red" /> : <Heart24Regular />}
                            onClick={handleLike}
                            className="like-button"
                        >
                            {currentLikes} إعجاب
                        </Button>
                    </div>
                </div>
                <p className="project-update-date">
                    آخر تحديث: {project.updatedAt ? new Date(project.updatedAt).toISOString().slice(0, 10) : '2023-10-25'}
                </p>
            </div>
        </header>
    );
};

const ProjectDescriptionSection = ({ project, onCategoryClick }) => {
    
    const keywordPills = useMemo(() => {
        if (!project.Keywords?.length) {
            return (
                <div className="empty-state">
                    لم يتم تحديد الكلمات المفتاحية بعد
                </div>
            );
        }

        return project.Keywords.map((keyword, index) => (
            <Badge
                key={index}
                appearance="tint"
                size="medium"
                className="keyword-pill"
            >
                {keyword.keyword}
            </Badge>
        ));
    }, [project.Keywords]);

    return (
        <section className="project-card2 description-card">
            <div className="card-title">
                <BookOpen24Regular />
                <span>وصف المشروع</span>
            </div>
            <div className="project-description">
                {project.project_description || 'لا يوجد وصف للمشروع.'}
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
                    && <Link href={ref.reference_link}>{ref.reference_title} - {ref.reference_author}</Link>
                    || <span>{ref.reference_title} - {ref.reference_author}</span>
                )
            })}
            {project?.References?.length || <span className="placeholder-label">لم يتم إرفاق المراجع</span>}
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
                {project?.Categories?.slice(0, 2).map((category, index) => (
                    <Badge 
                        key={index} 
                        appearance="tint"
                        size="medium"
                        className="keyword-pill"
                    >
                        {category.category_name}
                    </Badge>
                ))}
            </ul>
        </section>
    )
};

const CommentsSection = () => (
    <section className="project-card2">
        <div className="card-title">
            <Comment24Regular />
            <span>التعليقات</span>
        </div>
        <p className="comments-placeholder">
           لا توجد تعليقات
        </p>
    </section>
);

const FilesSection = () => (
    <section className="project-card2">
        <div className="card-title">
            <ArrowDown24Regular />
            <span>ملفات المشروع</span>
        </div>
        <div className="action-buttons">
            <Button 
                appearance="primary" 
                size="medium"
                className="action-btn"
            >
                كتاب المشروع
            </Button>
            <Button 
                appearance="secondary" 
                size="medium"
                className="action-btn"
            >
                عرض تقديمي
            </Button>
        </div>
    </section>
);

const TeamSection = ({ project, onPersonClick }) => {
    
    const supervisorDisplayName = useMemo(() => {
        return project.Supervisor ? 
            PERSON_TYPE_CONFIG.supervisor.displayName(project.Supervisor) : 
            'غير محدد';
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
                <Building24Regular />
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
export default function ProjectDisplay() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rating, setRating] = useState(0);
    const [likes, setLikes] = useState(0);

    useEffect(() => {
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

        fetchProject();
    }, [projectId]);

    const handleBackClick = useCallback(() => {
        navigate('/home');
    }, [navigate]);

    const handleLikeClick = useCallback(() => {
        // منطق الإعجاب
    }, []);

    const handleRatingChange = useCallback((_, data) => {
        setRating(data.value);
    }, []);

    const handleCategoryClick = useCallback((category) => {
        return () => {
            dispatch(selectHeaderTab('categories'));
            dispatch(selectCollage(category.collage_id));
            dispatch(selectCategory(category.category_id));
            navigate('/home');
        };
    }, [dispatch, navigate]);

    const handlePersonClick = useCallback((person, type) => {
        return () => {
            const config = PERSON_TYPE_CONFIG[type];
            dispatch(selectPeopleTab(config.peopleTab));
            dispatch(setPerson(person[config.idField]));
        };
    }, [dispatch]);

    const handleCommentClick = useCallback(() => {
        // منطق التعليقات
    }, []);

    if (loading) {
        return (
            <Loading 
                text="جار تحميل بيانات المشروع" 
                vertical 
                full={true} 
                size="extra-large"
            />
        );
    }

    if (error || !project) {
        return (
            <div className="project-error-container">
                <div className="project-error-content">
                    <h2>{error || 'المشروع غير موجود'}</h2>
                    <Button appearance="primary" onClick={handleBackClick}>
                        العودة إلى الصفحة الرئيسية
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="project-display-container">
            <PlatformHeader
                style={{ background: tokens.colorNeutralBackground1 }}
                caption={`مشروع ${project.project_title || ''}`}
                handleBackButtonClick={handleBackClick}
            />

            <div className="project-main-container">
                <ProjectHeaderSection 
                    project={project}
                    rating={rating}
                    likes={likes}
                    onLikeClick={handleLikeClick}
                />

                <div className="project-grid-layout">
                    <main className="project-main-content">
                        <ProjectDescriptionSection 
                            project={project}
                            onCategoryClick={handleCategoryClick}
                        />
                        <CategoriesSection project={project}/>
                        <ReferencesSection project={project}/>
                        <CommentsSection project={project}/>
                    </main>

                    <aside className="project-sidebar">
                        <FilesSection />
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