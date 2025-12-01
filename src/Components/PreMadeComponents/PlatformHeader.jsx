import { useNavigate } from "react-router-dom"
import Header from "./Header"
import { Button } from "@fluentui/react-components"
import { ArrowRight20Regular } from "@fluentui/react-icons";
import logo from '../../resources/logo.png'

/**
 * 
 * @param {React.HTMLProps} props 
 * @returns 
 */
export default function PlatformHeader(props) {
    
    const navigate = useNavigate();

    return <Header
        className='gap-8px bg-3'
        contentBefore={
            <Button 
                icon={<ArrowRight20Regular/>} 
                onClick={() => navigate(-1)} 
                appearance="transparent"
            />
        }
        logo={logo}
        caption={'توثيق مشاريع التخرج الجامعية'}
        captionClickEvent={() => navigate('/intro')}
        style={{paddingTop: '13px', paddingBottom: '13px'}}
        {...props}
    />
}