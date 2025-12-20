import { Spinner } from "@fluentui/react-components";


export default function Loading({ full }) {

    return (
        <div style={{
            height: full && '100%' || 'auto',
            width: full && '100%' || 'auto',
            display: 'grid',
            placeItems: 'center',
            padding: '13px'
        }}>
            <Spinner className="spinner"/>
        </div>
    )
}