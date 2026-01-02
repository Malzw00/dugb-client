import {
  Folder28Regular,
  Add16Regular, 
  Document16Regular,
  ArrowDownload16Regular,
  MoreHorizontal16Regular,
  Book16Color,
  Calendar16Color
} from "@fluentui/react-icons";
import Body from "./Body";
import { useEffect, useState, useCallback } from "react";
import { getFiles, uploadFile, deleteFile } from "@root/src/services/files";
import { 
  getBookFile, 
  setBook, 
  deleteBookFile,
  getPresentationFile,
  setPresentation,
  deletePresentationFile
} from "@root/src/services/project/file";
import { 
  Button, 
  Dropdown, 
  Option, 
  Spinner, 
  Text, 
  Badge, 
  Field, 
  tokens,
  ProgressBar,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Tooltip
} from "@fluentui/react-components";
import baseURL from "@root/src/config/baseURL.config";

export default function ProjectFilesBody({ currentProject }) {
  return (
    <Body
      style={{ flex: '1' }}
      icon={<Folder28Regular />}
      title={'ملفات المشروع'}
      content={
        <div style={{ padding: '0 5%' }}>
          <Content currentProject={currentProject} />
        </div>
      }
    />
  );
}

function Content({ currentProject }) {
  const [availableFiles, setAvailableFiles] = useState([]);
  const [projectFiles, setProjectFiles] = useState({
    book: null,
    presentation: null
  });
  const [loading, setLoading] = useState({
    files: false,
    book: false,
    presentation: false
  });
  const [uploading, setUploading] = useState({
    book: false,
    presentation: false
  });
  const [uploadProgress, setUploadProgress] = useState({
    book: 0,
    presentation: 0
  });
  
  const [showAddFile, setShowAddFile] = useState({
    book: false,
    presentation: false
  });
  const [selectedFile, setSelectedFile] = useState({
    book: null,
    presentation: null
  });
  
  // حالة لنموذج رفع ملف جديد
  const [showUploadForm, setShowUploadForm] = useState({
    book: false,
    presentation: false
  });
  const [uploadForm, setUploadForm] = useState({
    book: null,
    presentation: null
  });
  
  // جلب الملفات المتاحة من النظام
  const fetchAvailableFiles = useCallback(async (type = 'book') => {
    try {
      const res = await getFiles();
      const files = res.data?.result || [];
      
      // تصفية الملفات حسب النوع (كتاب أو عرض تقديمي)
      const filteredFiles = files.filter(file => {
        if (type === 'book') {
          // يمكن إضافة منطق لتصفية ملفات الكتب
          return file.stored_name?.toLowerCase().includes('.pdf') || 
                 file.stored_name?.toLowerCase().includes('.doc') ||
                 file.category === 'book';
        } else {
          // ملفات العروض التقديمية
          return file.stored_name?.toLowerCase().includes('.ppt') || 
                 file.stored_name?.toLowerCase().includes('.pptx') ||
                 file.category === 'presentation';
        }
      });
      
      setAvailableFiles(prev => ({ ...prev, [type]: filteredFiles }));
      
    } catch (err) {
      console.error('fetch files failed:', err);
      alert('فشل جلب الملفات المتاحة');
    }
  }, []);

  // جلب ملفات المشروع الحالية
  const fetchProjectFiles = useCallback(async () => {
    setLoading(prev => ({ ...prev, book: true, presentation: true }));
    
    try {
      // جلب ملف الكتاب
      try {
        const bookRes = await getBookFile(currentProject.project_id);
        if (bookRes.data?.result) {
          setProjectFiles(prev => ({ ...prev, book: bookRes.data.result }));
        }
      } catch (err) {
        console.error('fetch book file failed:', err);
        // قد لا يكون هناك ملف كتاب، هذا طبيعي
      }

      // جلب ملف العرض التقديمي
      try {
        const presentationRes = await getPresentationFile(currentProject.project_id);
        if (presentationRes.data?.result) {
          setProjectFiles(prev => ({ ...prev, presentation: presentationRes.data.result }));
        }
      } catch (err) {
        console.error('fetch presentation file failed:', err);
        // قد لا يكون هناك ملف عرض، هذا طبيعي
      }
      
    } catch (err) {
      console.error('fetch project files failed:', err);
      alert('فشل جلب ملفات المشروع');
    } finally {
      setLoading(prev => ({ ...prev, book: false, presentation: false }));
    }
  }, [currentProject.project_id]);

  // رفع ملف جديد إلى النظام
  const handleUploadFile = async (type) => {
    const file = uploadForm[type];
    if (!file) {
      alert('يرجى اختيار ملف للرفع');
      return;
    }

    setUploading(prev => ({ ...prev, [type]: true }));
    setUploadProgress(prev => ({ ...prev, [type]: 0 }));

    try {
      const onProgress = (percent) => {
        setUploadProgress(prev => ({ ...prev, [type]: percent }));
      };

      // رفع الملف إلى النظام
      const uploadRes = await uploadFile(file, type, onProgress);
      const uploadedFile = uploadRes.data?.result;

      if (uploadedFile) {
        // ربط الملف المرفوع بالمشروع
        await handleAddFileToProject(type, uploadedFile.file_id);
        
        // تحديث القوائم
        await fetchAvailableFiles(type);
        await fetchProjectFiles();
        
        // إعادة تعيين الحقول
        setUploadForm(prev => ({ ...prev, [type]: null }));
        setShowUploadForm(prev => ({ ...prev, [type]: false }));
        
        alert(`تم رفع الملف بنجاح!`);
      }
      
    } catch (err) {
      console.error('upload file failed:', err);
      alert('فشل رفع الملف: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
      setUploadProgress(prev => ({ ...prev, [type]: 0 }));
    }
  };

  // إضافة ملف من القائمة المتاحة للمشروع
  const handleAddFileToProject = async (type, fileId) => {
    try {
      if (type === 'book') {
        await setBook({
          projectId: currentProject.project_id,
          fileId: fileId,
        });
      } else if (type === 'presentation') {
        await setPresentation({
          projectId: currentProject.project_id,
          fileId: fileId,
        });
      }
      
      // تحديث القائمة
      await fetchProjectFiles();
      await fetchAvailableFiles(type);
      
      setSelectedFile(prev => ({ ...prev, [type]: null }));
      setShowAddFile(prev => ({ ...prev, [type]: false }));
      
      alert('تم إضافة الملف للمشروع بنجاح!');
      
    } catch (err) {
      console.error('add file to project failed:', err);
      alert('فشل إضافة الملف للمشروع: ' + (err.response?.data?.message || err.message));
    }
  };

  // حذف ملف من المشروع
  const handleDeleteFile = async (type) => {
    if (!window.confirm(`هل أنت متأكد من حذف ملف ${type === 'book' ? 'الكتاب' : 'العرض التقديمي'} من المشروع؟`)) {
      return;
    }

    try {
      if (type === 'book') {
        await deleteBookFile(currentProject.project_id);
      } else if (type === 'presentation') {
        await deletePresentationFile(currentProject.project_id);
      }
      
      // تحديث القائمة
      setProjectFiles(prev => ({ ...prev, [type]: null }));
      
      // تحديث الملفات المتاحة
      await fetchAvailableFiles(type);
      
      alert(`تم حذف الملف من المشروع بنجاح!`);
      
    } catch (err) {
      console.error('delete file failed:', err);
      alert('فشل حذف الملف: ' + (err.response?.data?.message || err.message));
    }
  };

  // حذف ملف من النظام
  const handleDeleteFromSystem = async (fileId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الملف من النظام؟')) {
      return;
    }

    try {
      await deleteFile(fileId);
      
      // تحديث القوائم لجميع الأنواع
      await fetchAvailableFiles('book');
      await fetchAvailableFiles('presentation');
      
      alert('تم حذف الملف من النظام بنجاح!');
      
    } catch (err) {
      console.error('delete from system failed:', err);
      alert('فشل حذف الملف: ' + (err.response?.data?.message || err.message));
    }
  };

  // تحميل الملف
  const handleDownloadFile = (fileUrl, fileName) => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    } else {
      alert('رابط التحميل غير متوفر');
    }
  };

  // الحصول على أيقونة الملف حسب النوع
  const getFileIcon = (fileName) => {
    if (!fileName) return <Document16Regular />;
    
    const ext = fileName.toLowerCase().split('.').pop();
    switch (ext) {
      case 'pdf':
        return <Book16Color/>;
      case 'doc':
      case 'docx':
        return <Book16Color/>;
      case 'ppt':
      case 'pptx':
        return <Calendar16Color/>;
      default:
        return <Document16Regular />;
    }
  };

  useEffect(() => {
    fetchProjectFiles();
  }, [fetchProjectFiles]);

  useEffect(() => {
    if (showAddFile.book || showUploadForm.book) {
      fetchAvailableFiles('book');
    }
    if (showAddFile.presentation || showUploadForm.presentation) {
      fetchAvailableFiles('presentation');
    }
  }, [showAddFile.book, showAddFile.presentation, showUploadForm.book, showUploadForm.presentation, fetchAvailableFiles]);

  const renderFileSection = (type, title, description) => {
    const file = projectFiles[type];
    const isLoading = loading[type];
    const isUploading = uploading[type];
    const progress = uploadProgress[type];
    const showAdd = showAddFile[type];
    const showUpload = showUploadForm[type];
    
    return (
      <div style={{
        backgroundColor: '#faf9f8',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e1dfdd',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <div>
            <div><Text size={500} weight="semibold">{title}</Text></div>
            <Text size={200} style={{ color: tokens.colorNeutralForeground3, marginTop: '4px' }}>
              {description}
            </Text>
          </div>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spinner label="جاري تحميل..." />
          </div>
        ) : file ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '16px',
            border: '1px solid #e1dfdd',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '24px' }}>
                {getFileIcon(file.stored_name)}
              </div>
              <div>
                <Text weight="semibold">{file.stored_name}</Text>
                <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                  {file.file_size ? `الحجم: ${formatFileSize(file.file_size)}` : ''}
                </Text>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                icon={<ArrowDownload16Regular />}
                onClick={() => handleDownloadFile(`${baseURL}/${file.path}/${file.stored_name}`, file.stored_name)}
                appearance="subtle"
                title="تحميل الملف"
              />
              
              <Menu>
                <MenuTrigger>
                  <Button
                    icon={<MoreHorizontal16Regular />}
                    appearance="subtle"
                    title="المزيد من الخيارات"
                  />
                </MenuTrigger>
                <MenuPopover>
                  <MenuList>
                    <MenuItem onClick={() => handleDeleteFile(type)}>
                      حذف من المشروع
                    </MenuItem>
                    {file.file_id && (
                      <MenuItem onClick={() => handleDeleteFromSystem(file.file_id)}>
                        حذف من النظام
                      </MenuItem>
                    )}
                  </MenuList>
                </MenuPopover>
              </Menu>
            </div>
          </div>
        ) : showAdd ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            border: '1px dashed #e1dfdd'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', gap: '8px' }}>
              <Badge appearance="filled" shape="rounded">
                {availableFiles[type]?.length || 0}
              </Badge>
              <Text size={300}>ملفات {type === 'book' ? 'كتب' : 'عروض تقديمية'} متاحة</Text>
            </div>

            {availableFiles[type]?.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '20px', 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Text>لا توجد ملفات متاحة</Text>
                <Button
                  appearance="secondary"
                  onClick={() => setShowAddFile(prev => ({ ...prev, [type]: false }))}
                  style={{ marginTop: '12px' }}
                >
                  رفع ملف جديد
                </Button>
              </div>
            ) : (
              <>
                <Field
                  label={`اختر ملف ${type === 'book' ? 'كتاب' : 'عرض تقديمي'}`}
                  style={{ marginBottom: '16px' }}
                >
                  <Dropdown
                    placeholder={`اختر ملفاً...`}
                    value={
                      selectedFile[type] ?
                        availableFiles[type]?.find(f => f.file_id === selectedFile[type])?.file_name
                        : ''
                    }
                    selectedOptions={selectedFile[type] ? [selectedFile[type]] : []}
                    onOptionSelect={(_, data) => setSelectedFile(prev => ({ ...prev, [type]: data.selectedOptions[0] }))}
                    style={{ width: '100%' }}
                  >
                    {availableFiles[type]?.map((file) => (
                      <Option
                        key={file.file_id}
                        value={file.file_id}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {getFileIcon(file.stored_name)}
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Text>{file.stored_name}</Text>
                            {file.size && (
                              <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                                {formatFileSize(file.size)}
                              </Text>
                            )}
                          </div>
                        </div>
                      </Option>
                    ))}
                  </Dropdown>
                </Field>

                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  <Button
                    appearance="primary"
                    onClick={() => handleAddFileToProject(type, selectedFile[type])}
                    disabled={!selectedFile[type]}
                    icon={<Add16Regular />}
                  >
                    إضافة للمشروع
                  </Button>
                  <Button
                    appearance="secondary"
                    onClick={() => {
                      setShowAddFile(prev => ({ ...prev, [type]: false }));
                      setSelectedFile(prev => ({ ...prev, [type]: null }));
                    }}
                  >
                    إلغاء
                  </Button>
                  <Button
                    appearance="secondary"
                    onClick={() => setShowAddFile(prev => ({ ...prev, [type]: false }))}
                  >
                    رفع ملف جديد
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : showUpload ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            border: '1px dashed #e1dfdd'
          }}>
            <Text weight="semibold" style={{ marginBottom: '16px' }}>
              رفع ملف {type === 'book' ? 'كتاب' : 'عرض تقديمي'} جديد
            </Text>
            
            <Field
              label="اختر ملفاً"
              required
              style={{ marginBottom: '16px' }}
            >
              <input
                type="file"
                accept={type === 'book' ? ".pdf,.doc,.docx" : ".ppt,.pptx"}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setUploadForm(prev => ({ ...prev, [type]: file }));
                  }
                }}
                style={{ padding: '8px', }}
              />
            </Field>

            {uploadForm[type] && (
              <div style={{
                backgroundColor: '#f3f2f1',
                padding: '12px',
                borderRadius: '4px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {getFileIcon(uploadForm[type].name)}
                <Text>{uploadForm[type].name}</Text>
                <Text size={200} style={{ color: tokens.colorNeutralForeground3, marginLeft: 'auto' }}>
                  {formatFileSize(uploadForm[type].size)}
                </Text>
              </div>
            )}

            {isUploading && (
              <div style={{ marginBottom: '16px' }}>
                <ProgressBar value={progress} max={100} />
                <Text size={200} style={{ textAlign: 'center', marginTop: '4px' }}>
                  جاري الرفع: {progress}%
                </Text>
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                appearance="primary"
                onClick={() => handleUploadFile(type)}
                disabled={isUploading || !uploadForm[type]}
                icon={isUploading ? <Spinner size="tiny" /> : <Add16Regular />}
              >
                {isUploading ? 'جاري الرفع...' : 'رفع الملف'}
              </Button>
              <Button
                appearance="secondary"
                onClick={() => {
                  setShowUploadForm(prev => ({ ...prev, [type]: false }));
                  setUploadForm(prev => ({ ...prev, [type]: null }));
                }}
                disabled={isUploading}
              >
                إلغاء
              </Button>
            </div>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            padding: '40px',
            backgroundColor: '#f3f2f1',
            borderRadius: '8px',
            border: '1px dashed #e1dfdd',
            gap: '13px',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text style={{ marginBottom: '16px' }}>
              لم يتم {type === 'book' ? 'إضافة كتاب' : 'إضافة عرض تقديمي'} بعد
            </Text>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <Button
                onClick={() => setShowUploadForm(prev => ({ ...prev, [type]: true }))}
                appearance="primary"
                icon={<Add16Regular />}
              >
                رفع ملف جديد
              </Button>
              <Button
                onClick={() => setShowAddFile(prev => ({ ...prev, [type]: true }))}
                appearance="secondary"
                icon={<Add16Regular />}
              >
                اختر ملفاً
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{
      flex: '1',
      paddingRight: '21px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      paddingBottom: '50px'
    }}>
      {/* ملفات المشروع الحالية */}
      <div className='flex-col gap-13px'>
        {renderFileSection(
          'book',
          'ملف الكتاب',
          'رفع أو اختيار ملف الكتاب الخاص بالمشروع (PDF, DOC, DOCX)'
        )}
        
        {renderFileSection(
          'presentation',
          'ملف العرض التقديمي',
          'رفع أو اختيار ملف العرض التقديمي للمشروع (PPT, PPTX)'
        )}
      </div>
    </div>
  );
}

// دالة مساعدة لتنسيق حجم الملف
function formatFileSize(bytes) {
  if (bytes === 0) return '0 بايت';
  
  const k = 1024;
  const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// مكون لعرض الملف
function FileItem({ file, onDownload, onDelete, onDeleteFromSystem }) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      border: `1px solid ${tokens.colorNeutralStroke2}`,
      padding: '12px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '12px',
      transition: 'all 0.2s'
    }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ fontSize: '20px' }}>
          {(() => {
            const fileName = file.stored_name || file.name || '';
            if (!fileName) return <Document16Regular />;
            
            const ext = fileName.toLowerCase().split('.').pop();
            switch (ext) {
              case 'pdf':
                return <Document16Regular style={{ color: '#F40F02' }} />;
              case 'doc':
              case 'docx':
                return <Document16Regular style={{ color: '#2B579A' }} />;
              case 'ppt':
              case 'pptx':
                return <Document16Regular style={{ color: '#D24726' }} />;
              default:
                return <Document16Regular />;
            }
          })()}
        </div>
        <div>
          <Text weight="semibold">{file.stored_name || file.name}</Text>
          {file.file_size && (
            <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
              {formatFileSize(file.file_size)}
            </Text>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '4px' }}>
        <Button
          icon={<ArrowDownload16Regular />}
          onClick={onDownload}
          appearance="subtle"
          size="small"
          title="تحميل الملف"
        />
        <Menu>
          <MenuTrigger>
            <Button
              icon={<MoreHorizontal16Regular />}
              appearance="subtle"
              size="small"
              title="المزيد من الخيارات"
            />
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              {onDelete && (
                <MenuItem onClick={onDelete}>
                  حذف من المشروع
                </MenuItem>
              )}
              {onDeleteFromSystem && (
                <MenuItem onClick={onDeleteFromSystem}>
                  حذف من النظام
                </MenuItem>
              )}
            </MenuList>
          </MenuPopover>
        </Menu>
      </div>
    </div>
  );
}