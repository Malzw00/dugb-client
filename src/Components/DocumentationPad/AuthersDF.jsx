import DataForm from "./DataForm";
import { Button } from "@fluentui/react-components";
import { PeopleCommunity32Regular } from "@fluentui/react-icons";



// Authers Data Form
export default function AuthersDF () {

    return <DataForm
        className="authers-df"
        icon={<PeopleCommunity32Regular/>}
        caption='أدخل بيانات الطلبة والمشرفين'
    >  
        <Button appearance="primary">توثيق بيانات الطلبة</Button>
        <Button appearance="primary">إختيار المشرفين</Button>
    </DataForm>
}