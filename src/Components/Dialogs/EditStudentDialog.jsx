import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import Dialog from "./AbstractDialog";
import { clearControlDialog } from "@root/src/store/slices/controlDialog.slice";
import { Button, Input, Dropdown, Option, tokens } from "@fluentui/react-components";
import { updateStudent, getStudentById } from "@root/src/services/people";
import { getAllCollages, getDepartments } from "@root/src/services/collage";
import Loading from "@PreMadeComponents/Loading";

export default function EditStudentDialog({ currentStudent, onStudentUpdated }) {
    const dispatch = useDispatch();
    
    return (
        <Dialog
            style={{ width: '50%', maxWidth: '600px' }}
            title={'تعديل بيانات الطالب'}
            body={
                <DialogBody 
                    // بيانات الطالب
                    studentData={studentData}
                    fullName={fullName}
                    // معالجات تغيير البيانات
                    onStudentNameChange={handleInputChange('student_name')}
                    onStudentFatherNameChange={handleInputChange('student_father_name')}
                    onStudentGrandfatherNameChange={handleInputChange('student_grandfather_name')}
                    onStudentFamilyNameChange={handleInputChange('student_family_name')}
                    onStudentEmailChange={handleInputChange('student_email')}
                    // الكليات والأقسام
                    collages={collages}
                    departments={departments}
                    selectedCollage={selectedCollage}
                    selectedDepartment={selectedDepartment}
                    selectedCollageName={selectedCollageName}
                    selectedDepartmentName={selectedDepartmentName}
                    onCollageChange={handleCollageChange}
                    onDepartmentChange={handleDepartmentChange}
                    // حالة التحميل
                    isLoadingStudent={isLoadingStudent}
                    isLoadingCollages={isLoadingCollages}
                    isLoadingDepartments={isLoadingDepartments}
                    isLoading={isLoading}
                    // الخطأ
                    error={error}
                    // معالجات الأحداث
                    onKeyUp={handleKeyUp}
                />
            }
            onCloseBtnClick={handleClose}
            footer={
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: '5px' }}>
                    <Button 
                        appearance="secondary" 
                        onClick={handleClose}
                        disabled={isOverallLoading}
                    >
                        إلغاء
                    </Button>
                    <Button 
                        appearance="primary" 
                        onClick={handleDone}
                        disabled={isOverallLoading || !isFormValid}
                        icon={isLoading ? <Loading size="tiny" /> : undefined}
                    >
                        {isLoading ? 'جاري التحديث...' : 'تحديث'}
                    </Button>
                </div>
            }
        />
    );
}

