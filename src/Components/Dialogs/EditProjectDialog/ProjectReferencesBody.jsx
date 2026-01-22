import { 
  Dismiss16Regular, 
  Bookmark28Regular,
  Add16Regular, 
  Bookmark16Regular,
  Link16Regular 
} from "@fluentui/react-icons";
import Body from "./Body";
import { useEffect, useState, useCallback } from "react";
import { getReferences, createReference } from "@root/src/services/reference";
import { 
  getProjectReferences, 
  addProjectReference, 
  deleteProjectReference 
} from "@root/src/services/project/reference";
import { 
  Button, 
  Dropdown, 
  Option, 
  Spinner, 
  Text, 
  Badge, 
  Field, 
  Tag, 
  tokens,
  Input,
  Textarea,
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent
} from "@fluentui/react-components";

export default function ProjectReferencesBody({ currentProject }) {
  return (
    <Body
      style={{ flex: '1' }}
      icon={<Bookmark28Regular />}
      title={'مراجع المشروع'}
      content={
        <div style={{ padding: '0 5%' }}>
          <Content currentProject={currentProject} />
        </div>
      }
    />
  );
}

function Content({ currentProject }) {
  const [availableReferences, setAvailableReferences] = useState([]);
  const [projectReferences, setProjectReferences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingReference, setAddingReference] = useState(false);
  const [removingReference, setRemovingReference] = useState(null);
  const [showAddReference, setShowAddReference] = useState(false);
  const [selectedReference, setSelectedReference] = useState(null);
  
  // حالة لنموذج إنشاء مرجع جديد
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    link: '',
    author: ''
  });
  const [creatingReference, setCreatingReference] = useState(false);
  
  const fetchAvailableReferences = useCallback(async () => {
    try {
      const res = await getReferences();
      const references = res.data?.result || [];
      
      const projectReferenceIds = new Set(projectReferences.map(r => r.reference_id));
      const filteredReferences = references.filter(
        reference => !projectReferenceIds.has(reference.reference_id)
      );
      
      setAvailableReferences(filteredReferences);
    } catch (err) {
      console.error('fetch references failed:', err);
      alert('فشل جلب المراجع المتاحة');
    }
  }, [projectReferences]);

  // جلب مراجع المشروع الحالية
  const fetchProjectReferences = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProjectReferences(currentProject.project_id);
      const references = res.data?.result || [];
      
      setProjectReferences(references);
    } catch (err) {
      console.error('fetch project references failed:', err);
      alert('فشل جلب مراجع المشروع');
    } finally {
      setLoading(false);
    }
  }, [currentProject.project_id]);

  // إنشاء مرجع جديد في النظام
  const handleCreateReference = async () => {
    if (!createForm.title) {
      alert('يرجى إدخال عنوان المرجع');
      return;
    }

    setCreatingReference(true);
    try {
      // إنشاء المرجع في النظام
      const createRes = await createReference({
        title: createForm.title,
        link: createForm.link || '',
        author: createForm.author || ''
      });

      const newReference = createRes.data?.result;
      
      if (newReference) {
        // إغلاق النافذة وإعادة تعيين النموذج
        setShowCreateForm(false);
        setCreateForm({ title: '', link: '', author: '' });
        
        // تحديث قائمة المراجع المتاحة
        await fetchAvailableReferences();
        
        // إظهار رسالة نجاح
        alert('تم إنشاء المرجع بنجاح! يمكنك الآن إضافته للمشروع من القائمة المتاحة.');
      } else {
        throw new Error('فشل إنشاء المرجع');
      }
      
    } catch (err) {
      console.error('create reference failed:', err);
      alert('فشل إنشاء المرجع: ' + (err.response?.data?.message || err.message));
    } finally {
      setCreatingReference(false);
    }
  };

  // إضافة مرجع من القائمة المتاحة للمشروع
  const handleAddReference = async () => {
    if (!selectedReference) {
      alert('يرجى اختيار مرجع للإضافة');
      return;
    }

    setAddingReference(true);
    try {
      // إضافة المرجع المحدد للمشروع
      await addProjectReference({
        projectId: currentProject.project_id,
        referenceId: selectedReference
      });
      
      // تحديث القوائم
      await fetchProjectReferences();
      await fetchAvailableReferences();
      
      // إعادة تعيين الحقول
      setSelectedReference(null);
      // setShowAddReference(false);
      
      alert('تم إضافة المرجع للمشروع بنجاح!');
      
    } catch (err) {
      console.error('add reference failed:', err);
      alert('فشل إضافة المرجع: ' + (err.response?.data?.message || err.message));
    } finally {
      setAddingReference(false);
    }
  };

  // حذف مرجع من المشروع
  const handleDeleteReference = async (referenceId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المرجع من المشروع؟')) {
      return;
    }

    setRemovingReference(referenceId);
    try {
      await deleteProjectReference({
        projectId: currentProject.project_id,
        referenceId
      });
      
      // تحديث القائمة فوراً
      setProjectReferences(prev => prev.filter(r => r.reference_id !== referenceId));
      
      // تحديث المراجع المتاحة
      await fetchAvailableReferences();
      
      alert('تم حذف المرجع من المشروع بنجاح!');
      
    } catch (err) {
      console.error('remove reference failed:', err);
      alert('فشل حذف المرجع: ' + (err.response?.data?.message || err.message));
    } finally {
      setRemovingReference(null);
    }
  };

  // فتح الرابط
  const handleOpenLink = (link) => {
    if (!link) return;
    
    // فتح الرابط مباشرة في نافذة جديدة إذا كان رابط ويب
    if (link.startsWith('http://') || link.startsWith('https://')) {
      window.open(link, '_blank');
    } else {
      // إذا كان رابطاً عادياً غير ويب، يمكن عرضه في نافذة منبثقة
      alert(`الرابط: ${link}\n\nهذا الرابط ليس رابط ويب ولا يمكن فتحه مباشرة في المتصفح.`);
    }
  };

  // فتح إنشاء مرجع جديد وإضافته مباشرة
  const handleCreateAndAddReference = async () => {
    if (!createForm.title) {
      alert('يرجى إدخال عنوان المرجع');
      return;
    }

    setCreatingReference(true);
    try {
      // إنشاء المرجع في النظام
      const createRes = await createReference({
        title: createForm.title,
        link: createForm.link || '',
        author: createForm.author || ''
      });

      const newReference = createRes.data?.result;
      
      if (newReference) {
        // إضافة المرجع الجديد للمشروع مباشرة
        await addProjectReference({
          projectId: currentProject.project_id,
          referenceId: newReference.reference_id
        });
        
        // إغلاق النافذة وإعادة تعيين النموذج
        setShowCreateForm(false);
        setCreateForm({ title: '', link: '', author: '' });
        
        // تحديث القوائم
        await fetchProjectReferences();
        
        alert('تم إنشاء المرجع وإضافته للمشروع بنجاح!');
      } else {
        throw new Error('فشل إنشاء المرجع');
      }
      
    } catch (err) {
      console.error('create and add reference failed:', err);
      alert('فشل إنشاء المرجع: ' + (err.response?.data?.message || err.message));
    } finally {
      setCreatingReference(false);
    }
  };

  useEffect(() => {
    fetchProjectReferences();
  }, [fetchProjectReferences]);

  useEffect(() => {
    if (showAddReference) {
      fetchAvailableReferences();
    }
  }, [showAddReference, fetchAvailableReferences]);

  // تحديث القائمة المتاحة بعد كل عملية إضافة/حذف
  useEffect(() => {
    if (!showAddReference) return;
    fetchAvailableReferences();
  }, [projectReferences, showAddReference]);

  return (
    <div style={{
      flex: '1',
      paddingRight: '21px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      paddingBottom: '50px'
    }}>
      {/* مراجع المشروع الحالية */}
      <div className='flex-col gap-13px'>
        {/* أزرار التحكم */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            onClick={() => setShowAddReference(!showAddReference)}
            appearance="primary"
            icon={showAddReference ? <Dismiss16Regular /> : <Add16Regular />}
          >
            {showAddReference ? 'إغلاق إضافة المراجع' : 'إضافة مرجع'}
          </Button>
          <Button
            onClick={() => setShowCreateForm(true)}
            appearance="secondary"
            icon={<Add16Regular />}
          >
            إنشاء مرجع جديد
          </Button>
        </div>

        {showAddReference && (
          <div style={{
            backgroundColor: '#faf9f8',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e1dfdd'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <Text size={500} weight="semibold">إضافة مرجع للمشروع</Text>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {availableReferences.length > 0 && (
                  <Badge appearance="filled" shape="rounded">
                    {availableReferences.length}
                  </Badge>
                )}
                <Text size={300}>مراجع متاحة</Text>
                <Button
                  appearance="subtle"
                  size="small"
                  onClick={() => setShowCreateForm(true)}
                  style={{ marginRight: '8px' }}
                >
                  + إنشاء مرجع جديد
                </Button>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Spinner label="جاري جلب المراجع..." />
              </div>
            ) : availableReferences.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '24px',
                backgroundColor: '#f3f2f1',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <Text>لا توجد مراجع متاحة للإضافة</Text>
                <Button
                  appearance="primary"
                  onClick={() => setShowCreateForm(true)}
                  style={{ marginTop: '12px' }}
                >
                  إنشاء مرجع جديد
                </Button>
              </div>
            ) : (
              <>
                <Field
                  label="اختر مرجعاً من القائمة"
                  style={{ marginBottom: '16px' }}
                  hint="اختر مرجعاً من المراجع الموجودة في النظام"
                >
                  <Dropdown
                    placeholder="اختر مرجعاً..."
                    value={
                      selectedReference ?
                        availableReferences
                          .find(r => r.reference_id === selectedReference)?.reference_title
                        : ''
                    }
                    selectedOptions={selectedReference ? [selectedReference] : []}
                    onOptionSelect={(_, data) => setSelectedReference(data.selectedOptions[0])}
                    style={{ width: '100%' }}
                  >
                    {availableReferences.map((reference) => (
                      <Option
                        key={reference.reference_id}
                        value={reference.reference_id}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <Text>{reference.reference_title}</Text>
                          {reference.reference_author && (
                            <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                              {reference.reference_author}
                            </Text>
                          )}
                          {reference.reference_link && (
                            <Text size={200} style={{ 
                              color: tokens.colorNeutralForeground3,
                              direction: 'ltr',
                              textAlign: 'right'
                            }}>
                              {reference.reference_link.length > 50 ? 
                                `${reference.reference_link.substring(0, 50)}...` : 
                                reference.reference_link
                              }
                            </Text>
                          )}
                        </div>
                      </Option>
                    ))}
                  </Dropdown>
                </Field>

                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  <Button
                    appearance="primary"
                    onClick={handleAddReference}
                    disabled={addingReference || !selectedReference}
                    icon={addingReference ? <Spinner size="tiny" /> : <Add16Regular />}
                  >
                    {addingReference ? 'جاري الإضافة...' : 'إضافة المرجع للمشروع'}
                  </Button>
                  <Button
                    appearance="secondary"
                    onClick={() => {
                      setShowAddReference(false);
                      setSelectedReference(null);
                    }}
                  >
                    إلغاء
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* نافذة إنشاء مرجع جديد */}
        <Dialog open={showCreateForm}>
          <DialogSurface>
            <DialogBody>
              <DialogTitle>إنشاء مرجع جديد</DialogTitle>
              <DialogContent>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                  <Field
                    label="عنوان المرجع"
                    required
                  >
                    <Input
                      placeholder="أدخل عنوان المرجع..."
                      value={createForm.title}
                      onChange={(e) => setCreateForm(prev => ({ 
                        ...prev, 
                        title: e.target.value 
                      }))}
                    />
                  </Field>

                  <Field
                    label="الرابط (اختياري)"
                    hint="يمكن أن يكون رابط ويب (https://...) أو رابط عادي"
                  >
                    <Textarea
                      placeholder="أدخل رابط المرجع..."
                      value={createForm.link}
                      onChange={(e) => setCreateForm(prev => ({ 
                        ...prev, 
                        link: e.target.value 
                      }))}
                      rows={2}
                    />
                  </Field>

                  <Field
                    label="المؤلف (اختياري)"
                  >
                    <Input
                      placeholder="أدخل اسم المؤلف..."
                      value={createForm.author}
                      onChange={(e) => setCreateForm(prev => ({ 
                        ...prev, 
                        author: e.target.value 
                      }))}
                    />
                  </Field>
                </div>
              </DialogContent>
              <DialogActions>
                <div style={{ display: 'flex', gap: '8px', width: '100%', justifyContent: 'flex-end' }}>
                  <Button
                    style={{ width: 'max-content' }}
                    appearance="primary"
                    onClick={handleCreateAndAddReference}
                    disabled={creatingReference || !createForm.title}
                    icon={creatingReference ? <Spinner size="tiny" /> : <Add16Regular />}
                  >
                    {creatingReference ? 'جاري الإنشاء...' : 'إنشاء وإضافة للمشروع'}
                  </Button>
                  <Button
                    appearance="secondary"
                    onClick={handleCreateReference}
                    disabled={creatingReference || !createForm.title}
                  >
                    {creatingReference ? 'جاري الإنشاء...' : 'إنشاء فقط'}
                  </Button>
                  <Button
                    appearance="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setCreateForm({ title: '', link: '', author: '' });
                    }}
                  >
                    إلغاء
                  </Button>
                </div>
              </DialogActions>
            </DialogBody>
          </DialogSurface>
        </Dialog>

        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '40px'
          }}>
            <Spinner label="جاري تحميل المراجع..." />
          </div>
        ) : projectReferences.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '32px',
            backgroundColor: '#faf9f8',
            borderRadius: '8px',
            border: '1px dashed #e1dfdd',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
            <Text>لا يوجد مراجع مضافة للمشروع</Text>
            <Button
              appearance="primary"
              onClick={() => setShowAddReference(true)}
              style={{ marginTop: '12px' }}
            >
              إضافة مرجع
            </Button>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            backgroundColor: '#faf9f8',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #e1dfdd'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px',
              gap: '8px'
            }}>
              <Text size={500} weight="semibold">المراجع الحالية</Text>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Badge appearance="filled" shape="rounded">
                  {projectReferences.length}
                </Badge>
                <Button
                  appearance="subtle"
                  size="small"
                  onClick={() => setShowAddReference(true)}
                >
                  + إضافة المزيد
                </Button>
              </div>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              {projectReferences.map((reference) => (
                <ReferenceItem
                  key={reference.reference_id}
                  reference={reference}
                  onDelete={() => handleDeleteReference(reference.reference_id)}
                  onOpen={() => handleOpenLink(reference.reference_link)}
                  disabled={removingReference === reference.reference_id}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ReferenceItem({ reference, onDelete, onOpen, disabled }) {
  // تحديد نوع الرابط
  const getLinkType = (link) => {
    if (!link) return 'بدون رابط';
    if (link.startsWith('http://') || link.startsWith('https://')) return 'رابط ويب';
    return 'رابط';
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      border: `1px solid ${tokens.colorNeutralStroke2}`,
      padding: '12px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '12px',
      transition: 'all 0.2s',
      opacity: disabled ? 0.6 : 1
    }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bookmark16Regular style={{ color: '#0078d4' }} />
          <Text weight="semibold" style={{ cursor: reference.reference_link ? 'pointer' : 'default' }} 
                onClick={reference.reference_link ? onOpen : undefined}>
            {reference.reference_title}
          </Text>
          <Tag size="small" appearance="brand" style={{ marginLeft: 'auto' }}>
            {getLinkType(reference.reference_link)}
          </Tag>
        </div>

        {reference.reference_author && (
          <Text size={200} style={{ color: tokens.colorNeutralForeground3, marginRight: '24px' }}>
            المؤلف: {reference.reference_author}
          </Text>
        )}

        {reference.reference_link && (
          <Text size={200} style={{
            color: tokens.colorNeutralForeground3,
            marginRight: '24px',
            direction: 'ltr',
            textAlign: 'right',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '400px'
          }}>
            <Link16Regular style={{ verticalAlign: 'middle', marginLeft: '4px' }} />
            {reference.reference_link}
          </Text>
        )}
      </div>

      <div style={{ display: 'flex', gap: '4px' }}>
        {reference.reference_link && (
          <Button
            icon={<Link16Regular />}
            onClick={onOpen}
            appearance="subtle"
            size="small"
            title="فتح المرجع"
          />
        )}
        <Button
          icon={<Dismiss16Regular />}
          onClick={onDelete}
          appearance="subtle"
          size="small"
          disabled={disabled}
          title="حذف المرجع من المشروع"
        />
      </div>
    </div>
  );
}