import { Button, Display, Title1, Title3, tokens, } from "@fluentui/react-components";
import { Book24Color, Calendar24Color, Desktop24Filled, PictureInPicture24Filled, PictureInPicture24Regular, Square24Filled } from "@fluentui/react-icons";



export default function ControlArea({ className, dataContainer, toolbar, footer, title }) {

    return <div className={`control-area ${className?? ''}`}>

        {/* {<Title1 style={{ padding: '21px', display: 'flex' }}>{title}</Title1>} */}

        <div className="tool-bar">
            {toolbar || null}
        </div>
        
        <div className="data-container">
            {dataContainer || null}
        </div>

        <div className="ca-footer">
            {footer || null}
        </div>
    
    </div>
}

export function Row({ index, name, actions=[], extraCells=[], active=false, title }) {
    return (
        <div key={index} className={`row ${active && 'active'}`} title={title}>
            <div className="identity">
                <div className="index-num">
                    {index}
                </div>

                <div className="name">
                    <span>{name}</span>
                </div>
                
                {extraCells.map(cell => {
                    return <div className='cell'>
                        {cell.content}
                    </div>
                })}
            </div>
            
            
            <div className="actions">
                {(actions || []).map(action => {
                    return <Button 
                        appearance={action.appearance}
                        className={`action ${action.className}`} 
                        onClick={action.onClick || function (){}}>
                        
                        {action.content || null}
                    </Button>
                })}
            </div>
        </div>
    )
}


export function FileItem ({ filename, size, type, actions, lastUpdate, category }) {

    const rowStyle = { display: 'flex', flexDirection: 'row', gap: '5px' };
    const colStyle = { display: 'flex', flexDirection: 'column', gap: '5px' };
    const placeholderStyle = {
        fontSize: '12px', 
        color: tokens.colorNeutralForeground2
    };
    const categoryStyle = {
        background: category === 'book'
            ? tokens.colorBrandBackgroundSelected
            : tokens.colorPaletteRedBackground3,
        borderRadius: '8px',
        padding: '0px 8px',
        color: 'white',
        fontSize: '11px'
    }

    return (
        <div className="file-item" style={{...rowStyle, cursor: 'pointer', borderRadius: '13px'}}>
            <div style={{ 
                ...colStyle, 
                justifyContent: 'center', 
                alignItems: 'center', 
                padding: '8px', 
                width: '100px' }}>

                {category === 'book' && <Book24Color style={{ width: '100%', height: '100%' }}/>}
                {category === 'presentation' && <Calendar24Color style={{ width: '100%', height: '100%' }}/>}
            </div>

            <div style={{...colStyle, flex: '1', justifyContent: 'space-between', padding: '8px 0'}}>
                <div style={colStyle}>
                    <div style={rowStyle}>
                        <h3>{filename}</h3>
                        <span style={categoryStyle}>{category === 'book' && 'كتاب' || 'عرض تقديمي'}</span>
                    </div>
                    <div style={rowStyle}>
                        <span style={placeholderStyle}>{type}</span>
                        -
                        <span style={placeholderStyle}>{size}</span>
                    </div>
                    <span style={placeholderStyle}>آخر تحديث: {lastUpdate}</span>
                </div>
                <div style={{...rowStyle, }}>
                    {actions.map((action, index) => {
                        return (
                            <Button
                                key={index}
                                size={`${action.size || 'small'}`}
                                style={{ minWidth: '0' }}
                                appearance={`${action.appearance || 'secondary'}`}
                                className={`action ${action.className || ''}`}
                                onClick={action.onClick || (() => {})}>
                                {action.content}
                            </Button>
                        )
                    })}
                </div>
            </div>

        </div>
    );
}