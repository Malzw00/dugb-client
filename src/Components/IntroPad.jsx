import logo from '../resources/logo.png';
import { Button } from '@fluentui/react-components';
import { ArrowCircleLeft28Regular } from '@fluentui/react-icons';
import LogoImg from './PreMadeComponents/LogoImg';
import { useNavigate } from 'react-router-dom';


export default function IntroUI ({ onContinue }) {

    return (
        <div id='app-grid'>
            <LogoImg id='left-logo' src={logo} alt='left logo'/>

            <div id='intro-header'>
                <div id='intro-header-caption'>
                    <h1>جامعة أجدابيا</h1>
                    <h1>منصة توثيق مشاريع التخرج الجامعية</h1>
                </div>
                <EnterButton onContinue={onContinue}/>
            </div>


            <div id='intro-footer'>
                تم إعداد هذه المنصة بواسطة الطلبة: معاذ مفتاح عمران - سعيد جاد المولى سعيد - محمد علي سالم - 
                علي السنوسي عقيلة / تحت إشراف: الأستاذ قاسم حداد
            </div>
        </div>
    );
}



function EnterButton({ onContinue }) {

    const navegate = useNavigate();

    return (
        <Button  
            size='large' 
            icon={<ArrowCircleLeft28Regular/>} 
            appearance='primary'
            iconPosition='after'
            style={{
                display: 'flex', 
                justifyContent: 'space-between',
                gap: '8px', 
                padding: '8px 16px', 
                width: '233px',
            }}
            onClick={() => {
                if(sessionStorage['FstLoad'] === 'true')
                {    
                    navegate(-1);
                    return;
                }
                onContinue();
                sessionStorage.setItem('FstLoad', 'true');
            }}
        >الدخول</Button>
    )
}