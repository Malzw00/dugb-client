import deflogo from "../../resources/logo.png";
import LogoImg from "./LogoImg";


export default function Header({contentBefore, contentAfter, caption, logo, className, style, captionClickEvent}) {

    return (
        <header className={`header ${(className?? '')}`} style={style?? {}}>
            {contentBefore && <div className="header-content-before">{contentBefore}</div>}
            <div className='header-caption'>
                <LogoImg className='header-logo' src={logo?? deflogo} alt='left logo'/>
                <h2 onClick={captionClickEvent}>{caption}</h2>
            </div>
            {contentAfter && <div className="header-content-after">{contentAfter}</div>}
        </header>
    )
}