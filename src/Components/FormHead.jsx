import LogoImg from "./PreMadeComponents/LogoImg";



export default function FormHead({caption, title, logo}) {
    
    return (
        <div className='form-head'>
            <LogoImg src={logo} alt='Logo'/>
            <h3>{caption}</h3>
            <h3>{title}</h3>
        </div>
    );
}