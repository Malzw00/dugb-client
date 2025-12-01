import * as React from "react";
import { Button, Label, Textarea, tokens } from "@fluentui/react-components";
import {
    Book20Regular,
    Desktop20Regular,
    FolderLink20Regular,
    FolderArrowUp32Regular,
    Image20Regular,
    Link20Regular,
    Checkmark20Regular,
    Checkmark20Filled
} from "@fluentui/react-icons";
import DataForm from "./DataForm";



// Resources Form
export default function ResourcesDF() {
    return (
        <DataForm
            className="resources-f"
            icon={<FolderArrowUp32Regular />}
            caption="رفع ملفات المشروع"
        >
            <FileUploadButton label="رفع كتاب المشروع" icon={<Book20Regular />} />
            <FileUploadButton label="رفع العرض التقديمي" icon={<Desktop20Regular />} />
            <FileUploadButton label="رفع المراجع" icon={<FolderLink20Regular />} multiple={true}/>

            <div className='flex-col gap-8px'>
                <h4 className="flex-row gap-8px items-center"> <Link20Regular/> روابط المراجع</h4>
                <Textarea placeholder="روابط المراجع ..."></Textarea>
            </div>
            
            <FileUploadButton label="تحميل صورة الغلاف" icon={<Image20Regular />} />
        </DataForm>
    );
}




// مكون مساعد لإنشاء زر رفع ملف مخصص
function FileUploadButton({ label, icon, multiple }) {

    const inputRef = React.useRef(null);
    const [files, setFiles] = React.useState('');

    const handleClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    const handleChange = (e) => {
        const file = multiple? e.target.files : e.target.files?.[0];
        if (file) {
            setFiles(multiple? file: file.name);
        }
    };

    console.log(files)

    return (
        <>
            <input
                multiple={multiple}
                type="file"
                ref={inputRef}
                onChange={handleChange}
                style={{ display: "none" }}
            />
            <Button
                appearance="primary"
                onClick={handleClick}
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    backgroundColor: files? tokens.colorNeutralBackground3 : undefined,
                    color: files? tokens.colorBrandForeground2: undefined,
                    minWidth: "240px"
                }}
            >
                {(multiple? Array.from(files).map(file => file.name).join(' / '): files) || label}
                {files? <Checkmark20Filled style={{minWidth: '24px'}}/> : icon}
            </Button>
        </>
    );
}