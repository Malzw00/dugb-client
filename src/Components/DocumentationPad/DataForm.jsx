// Abstract Data Form
export default function DataForm (props) {

    const dataFormClass = 'flex-col width-100 gap-13px items-stretch paddingX-13px paddingY-8px';

    return <div {...props} className={`${props.className} ${dataFormClass}`}> 
    
        <div className="flex-row gap-8px items-end">
            {props.icon?? null}
            <h4>{props.caption?? null}</h4>
        </div>

        {props.children}

    </div>
}