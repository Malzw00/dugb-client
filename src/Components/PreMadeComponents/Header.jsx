import LogoImg from "@PreMadeComponents/LogoImg";


export default function Header({ contentBefore, contentAfter, caption, logo, className, style }) {

    return (
        <header className={`header ${(className?? '')}`} style={style?? {}}>
            {contentBefore && <div className="header-content-before">{contentBefore}</div>}
            <div className='header-caption'>
                {logo && <LogoImg className='header-logo' src={logo} alt='left logo'/>}
                <h2>{caption}</h2>
            </div>
            {contentAfter && <div className="header-content-after">{contentAfter}</div>}
        </header>
    )
}