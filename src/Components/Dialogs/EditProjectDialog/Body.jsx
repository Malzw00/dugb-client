import { Title3, tokens } from "@fluentui/react-components";

export default function Body({ title, style, icon, content, footer }) {

    return (
        <div 
            className="edit-dialog-body"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                ...style,
            }}>

            <div className="flex-row paddingY-21px items-center gap-13px paddingX-13px">
                {icon} 
                <Title3>{title}</Title3>
            </div>
            {content}
            {footer}
        </div>
    );
}