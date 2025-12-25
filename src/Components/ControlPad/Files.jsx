import { Button, Divider } from "@fluentui/react-components";
import ControlArea, { FileItem } from "./ControlArea";
import { ArrowCircleUp20Regular, ArrowClockwise20Regular, ArrowUpload16Regular, ArrowUpload20Filled, ArrowUpload20Regular, Delete16Regular, Delete20Regular, TrayItemRemove20Regular, } from "@fluentui/react-icons";
import React from "react";
import { getFiles } from "@root/src/services/files";

export default function Files() {
    
    const [files, setFiles] = React.useState([]);

    React.useEffect(() => {
        getFiles()
            .then(res => {
                setFiles(res.data?.result || [])
            })
    }, []);

    const renderDataContainer = function () {
        return (<div style={{ padding: '13px', }}>
            {files.map((file, index) => {
                return ([
                    (<FileItem 
                        key={index}
                        filename={file.stored_name}
                        type={file.mime_type}
                        category={file.category}
                        size={`${(file.size / (1024 * 1024)).toFixed(2)}MB`}
                        lastUpdate={new Date(file.updatedAt).toISOString().slice(0, 10)}
                        actions={[
                            ({ content: 'حذف' }),
                            ({ content: 'تعديل' })
                        ]}
                    />),
                    (files.length - index === 1 || <Divider style={{ margin: '5px 0' }}/>)
                ]);
            })}
        </div>);
    }
    
    return (
        <ControlArea
            toolbar={[
                (<Button
                    icon={<ArrowUpload20Filled/>}
                    appearance="primary">

                    رفع ملف
                </Button>),
                (<Button
                    icon={<ArrowClockwise20Regular/>}
                    appearance="secondary">

                    تحديث
                </Button>),
            ]}
            dataContainer={renderDataContainer()}
        />
    );
}