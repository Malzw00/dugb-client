import { Button } from "@fluentui/react-components";
import { Dismiss16Regular } from "@fluentui/react-icons";
import '@styles/dialog.css'

export default function Dialog({ style, className, title, onCloseBtnClick, body, footer }) {

    return (
        <div className="dialog-parent">
            <div className={`dialog ${className || ''}`} style={style?? {}}>
            
                <div className="header">
                    <div className="title">{title}</div>
                    <Button appearance="primary" className="close-btn" onClick={onCloseBtnClick}>
                        <Dismiss16Regular/>
                    </Button>
                </div>
                
                <div className="body">
                    {body || null}
                    <div className="footer">
                        {footer || null}
                    </div>
                </div>

            </div>
        </div>
    )
}