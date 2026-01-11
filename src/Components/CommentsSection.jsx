import { 
    Button,
    Textarea,
    Dialog,
    DialogBody,
    DialogContent,
    DialogTitle,
    DialogSurface,
    DialogActions,
    DialogTrigger,
    tokens,
} from "@fluentui/react-components";
import {
    Comment24Regular,
    Edit16Regular,
    Delete16Regular,
    Send24Regular
} from "@fluentui/react-icons";
import React, { useState, useEffect, useCallback } from "react";
import { getProjectComments, addProjectComment, deleteProjectComment } from "@services/project/social";
import { updateComment } from '@services/comment'
import { useSelector } from "react-redux";
import Loading from "./PreMadeComponents/Loading";

const CommentsSection = ({ project }) => {
    
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [editingComment, setEditingComment] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    
    const user = useSelector(state => state.user.value);

    const fetchComments = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getProjectComments(project.project_id);
            if (response.data?.success) {
                setComments(response.data.result || []);
            }
        } catch (error) {
            console.error("خطأ في جلب التعليقات:", error);
        } finally {
            setLoading(false);
        }
    }, [project.project_id]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            const response = await addProjectComment({
                projectId: project.project_id,
                content: newComment
            });

            if (response.data?.success) {
                setNewComment("");
                fetchComments(); // إعادة جلب التعليقات للتحديث
            }
        } catch (error) {
            console.error("خطأ في إضافة التعليق:", error);
            alert("حدث خطأ أثناء إضافة التعليق");
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("هل أنت متأكد من حذف هذا التعليق؟")) return;

        try {
            const response = await deleteProjectComment({
                projectId: project.project_id,
                commentId: commentId
            });

            if (response.data?.success) {
                fetchComments();
            }
        } catch (error) {
            console.error("خطأ في حذف التعليق:", error);
            alert("حدث خطأ أثناء حذف التعليق");
        }
    };

    // فتح نافذة تعديل التعليق
    const handleEditClick = (comment) => {
        setEditingComment(comment);
        setEditContent(comment.comment_content);
        setIsEditDialogOpen(true);
    };

    // حفظ التعديلات
    const handleSaveEdit = async () => {
        if (!editContent.trim()) return;

        try {
            const response = await updateComment(editingComment.comment_id, {
                content: editContent
            });

            if (response.data?.success) {
                setIsEditDialogOpen(false);
                fetchComments(); // إعادة جلب التعليقات بعد التعديل
            }
        } catch (error) {
            console.error("خطأ في تعديل التعليق:", error);
            alert("حدث خطأ أثناء تعديل التعليق");
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isCommentOwner = (comment) => {
        if(!comment) return;
        return user?.accountId && comment.account_id === user.accountId;
    };

    return (
        <section className="project-card2 comments-section">
            <div className="card-title">
                <Comment24Regular />
                <span>التعليقات ({comments.length})</span>
            </div>

            {/* قائمة التعليقات */}
            <div className="comments-list">
                {loading ? (
                    <Loading text="جارٍ تحميل التعليقات..." vertical={false} />
                ) : comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.comment_id} className="comment-item">
                            <div className="comment-header">
                                <div className="comment-author">
                                    <span 
                                        className="author-name"
                                        style={{ color: isCommentOwner(comment)
                                            ? tokens.colorBrandBackground
                                            : 'black' 
                                        }}>

                                        {`${comment.Account.fst_name} ${comment.Account.lst_name}` || "مستخدم"}
                                    </span>
                                </div>
                                
                                {isCommentOwner(comment) && (
                                    <div className="comment-actions">
                                        <Button
                                            size="small"
                                            appearance="subtle"
                                            icon={<Delete16Regular />}
                                            onClick={() => handleDeleteComment(comment.comment_id)}
                                            className="delete-comment-btn"
                                            title="حذف"
                                            />
                                        <Button
                                            size="small"
                                            appearance="subtle"
                                            icon={<Edit16Regular />}
                                            onClick={() => handleEditClick(comment)}
                                            className="delete-comment-btn"
                                            title="تعديل"
                                        />
                                    </div>
                                )}
                            </div>
                            
                            <div className="comment-content">
                                {comment.comment_content}
                            </div>
                            
                            <div className="comment-date">
                                {formatDate(comment.created_at)}
                            </div>
                            {comment.updated_at !== comment.created_at && (
                                <div className="comment-edited">
                                    تم التعديل بتاريخ {formatDate(comment.updated_at)}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="empty-state">
                        لا توجد تعليقات بعد. كن أول من يعلق!
                    </p>
                )}
            </div>

            {/* حقل إضافة تعليق جديد */}
            <div className="add-comment-container">
                <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="اكتب تعليقك هنا..."
                    className="comment-input"
                    size="medium"
                    resize="vertical"
                    rows={3}
                />
                <Button
                    appearance="primary"
                    icon={<Send24Regular />}
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="send-comment-btn"
                >
                    إرسال
                </Button>
            </div>

            {/* نافذة تعديل التعليق */}
            <Dialog open={isEditDialogOpen} onOpenChange={(e, data) => setIsEditDialogOpen(data.open)}>
                <DialogSurface>
                    <DialogBody>
                        <DialogTitle>تعديل التعليق</DialogTitle>
                        <DialogContent>
                            <Textarea
                                value={editContent}
                                onChange={(e) => {
                                    setEditContent(e.target.value)
                                }}
                                placeholder="عدل تعليقك هنا..."
                                className="edit-comment-input"
                                size="medium"
                                resize="vertical"
                                rows={4}
                            />
                        </DialogContent>
                        <DialogActions>
                            <DialogTrigger disableButtonEnhancement>
                                <Button appearance="secondary">إلغاء</Button>
                            </DialogTrigger>
                            <Button 
                                appearance="primary" 
                                onClick={handleSaveEdit}
                                disabled={!editContent.trim()}
                            >
                                حفظ التعديلات
                            </Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
        </section>
    );
};

export default CommentsSection;