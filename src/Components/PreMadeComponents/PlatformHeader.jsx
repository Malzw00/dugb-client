import { useNavigate } from "react-router-dom"
import Header from "./Header"
import { Button } from "@fluentui/react-components"
import { ArrowRight20Regular } from "@fluentui/react-icons";



export default function PlatformHeader({ caption, handleBackButtonClick }) {
    
    const navigate = useNavigate();

    return <Header
        className='gap-8px bg-3'
        contentBefore={
            <Button 
                icon={<ArrowRight20Regular/>} 
                onClick={handleBackButtonClick} 
                appearance="transparent"
            />
        }
        caption={caption}
        captionClickEvent={() => navigate('/intro')}
        style={{paddingTop: '13px', paddingBottom: '13px'}}
    />
}