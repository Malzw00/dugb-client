import LogoImg from "./PreMadeComponents/LogoImg";



export default function FormHead({caption, icon, title, logo}) {
    
    return (
        <div className='form-head'>
            <LogoImg src={logo} alt='Logo'/>
                <h3>{caption}</h3>
            <br />
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                {icon}
                <h3>{title}</h3>
            </div>
        </div>
    );
}