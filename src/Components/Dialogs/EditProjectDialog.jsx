// import React, { useState, useCallback, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import Dialog from "./AbstractDialog";
// import { 
//     Button, 
//     Input, 
//     Dropdown, 
//     Option, 
//     Textarea, 
//     tokens,
// } from "@fluentui/react-components";
// import { updateProject, getProjectById } from "@services/project/project";
// import Loading from "@PreMadeComponents/Loading";
// import { Folder20Regular } from "@fluentui/react-icons";
// import { clearControlDialog } from "@root/src/store/slices/controlDialog.slice";

// export default function EditProjectDialog({ selectedCollage, departments, currentProject }) {
    
//     if (!selectedCollage || !currentProject) {
//         return (
//             <Dialog
//                 style={{ minWidth: '35%' }}
//                 title={'تعديل مشروع'}
//                 body={
//                     <div style={{ padding: '16px 0', textAlign: 'center', color: '#ef4444' }}>
//                         {!selectedCollage ? 'لم يتم تحديد كلية' : 'لم يتم تحديد مشروع للتعديل'}
//                     </div>
//                 }
//                 onCloseBtnClick={handleCloseDialog}
//                 footer={
//                     <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: '5px' }}>
//                         <Button 
//                             appearance="secondary" 
//                             onClick={handleCloseDialog}>
//                             إغلاق
//                         </Button>
//                     </div>
//                 }
//             />
//         );
//     }

//     if (isLoadingProject) {
//         return (
//             <Dialog
//                 style={{ minWidth: '40%' }}
//                 title={'تعديل مشروع'}
//                 body={
//                     <div style={{ padding: '40px', textAlign: 'center' }}>
//                         <Loading size="extra-large" vertical text={'جاري تحميل بيانات المشروع...'}/>
//                     </div>
//                 }
//                 onCloseBtnClick={handleCloseDialog}
//                 footer={
//                     <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: '5px' }}>
//                         <Button 
//                             appearance="secondary" 
//                             onClick={handleCloseDialog}
//                             disabled={true}
//                         >
//                             إغلاق
//                         </Button>
//                     </div>
//                 }
//             />
//         );
//     }

//     return (
//         <Dialog
//             style={{ width: '60%', minWidth: '700px', maxHeight: '90vh' }}
//             title={`تعديل مشروع - ${currentProject.project_title || 'بدون عنوان'}`}
//             body={
//                 <DialogBody 
//                     formData={formData}
//                     error={error}
//                     isLoading={isLoading}
//                     departments={departments}
//                     semesterOptions={semesterOptions}
//                     onInputChange={handleInputChange}
//                 />
//             }
//             onCloseBtnClick={handleCloseDialog}
//             footer={
//                 <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: '5px' }}>
//                     <Button 
//                         appearance="secondary" 
//                         onClick={handleCloseDialog}
//                         disabled={isLoading}
//                     >
//                         إلغاء
//                     </Button>
//                     <Button 
//                         appearance="primary" 
//                         onClick={handleDone}
//                         disabled={isLoading}
//                         icon={isLoading ? <Loading size="tiny" /> : undefined}
//                     >
//                         {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
//                     </Button>
//                 </div>
//             }
//         />
//     );
// }
