import { Dropdown, Label, Option, Textarea } from "@fluentui/react-components";
import { Apps32Regular } from "@fluentui/react-icons";
import DataForm from "./DataForm";



// classification Data Form
export default function ClassificationDF () {

    return <DataForm 
        className={`classification-df`}
        icon={<Apps32Regular/>}
        caption='أدخل تصنيفات المشروع'
    > 

        <Dropdown placeholder="إختر الفئات">
            <Option>ذكاء اصطناعي</Option>
            <Option>تطبيقات الموبايل</Option>
            <Option>موقع ويب</Option>
        </Dropdown>

        <Textarea placeholder="أدخل الكلمات المفتاحية"> 

        </Textarea>

        <Label className="warning-label"></Label>
    </DataForm>
}