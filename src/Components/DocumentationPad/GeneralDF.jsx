import { Button, Dropdown, Input, Label, Option } from "@fluentui/react-components";
import { Building20Regular, Calendar16Regular, Library32Regular } from "@fluentui/react-icons";
import DataForm from "./DataForm";

// General Data Form
export default function GeneralDF () {

    return <DataForm 
        className='general-df'
        icon={<Library32Regular/>}
        caption='أدخل بيانات الكلية والفصل'
    > 

        <Dropdown placeholder="إختر الكلية" clearIcon={<Building20Regular/>}>
            <Option>كلية تقنية المعلومات</Option>
            <Option>كلية الإقتصاد</Option>
            <Option>كلية الهندسة</Option>
        </Dropdown>
        
        <Dropdown placeholder="إختر التخصص">
            <Option>قسم علوم الحاسب</Option>
            <Option>قسم IT</Option>
        </Dropdown>
        
        <Dropdown placeholder="إختر الفصل">
            <Option>فصل الخريف</Option>
            <Option>فصل الربيع</Option>
            <Option>فصل الشتاء</Option>
            <Option>فصل الصيف</Option>
        </Dropdown>

        <Input 
            placeholder="أدخل السنة" 
            contentBefore={<Calendar16Regular/>}
            contentAfter={
                <Button appearance="transparent">
                    إدراج السنة الحالية
                </Button>
            }
        />

        <Label className="warning-label"></Label>

    </DataForm>
}