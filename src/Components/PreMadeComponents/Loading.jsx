import { Spinner } from "@fluentui/react-components";

export default function Loading({ full, paddingless, size, text, vertical, style }) {

    return (
        <div style={{
            height: full && '100%' || 'auto',
            width: full && '100%' || 'auto',
            display: 'grid',
            placeItems: 'center',
            padding: paddingless && '0' || '13px',
            ...style
        }}>
            <div style={{
                display: 'flex',
                gap: '13px',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: vertical && 'column'
            }}>
                <Spinner size={size?? 'medium'} className="spinner"/>
                {text && <span>{text}</span>}
            </div>
        </div>
    )
}