import { Option, Dropdown, Input, Label, Textarea } from "@fluentui/react-components";
import { Edit20Regular, AlignBottom20Regular, Book32Regular } from "@fluentui/react-icons";
import DataForm from "./DataForm";

// Project Data Form
export default function ProjectDF (props) {

    return <DataForm 
        className={`project-df`}
        icon={<Book32Regular/>}
        caption='أدخل معلومات المشروع'
    > 

        <Input
            placeholder="أدخل عنوان المشروع" 
            contentBefore={<Edit20Regular/>}
        />

        <Textarea placeholder="وصف المشروع" style={{height:'89px'}}/>
        
        <Input placeholder="درجة" contentBefore={<AlignBottom20Regular/>}/>

        <Textarea placeholder="ملخص" style={{height:'89px'}}/>
        
        <Label className="warning-label"></Label>
    </DataForm>
}