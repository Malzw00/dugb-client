import DocSide from './DocSide';
import logo from '../../resources/logo.png';
import '../../Styles/DocumentationPad.css';
import LogoImg from '../PreMadeComponents/LogoImg';
import Header from '../PreMadeComponents/Header';
import { Button } from '@fluentui/react-components';
import { ArrowRight20Regular, Home20Regular, Home24Regular } from '@fluentui/react-icons';
import { useNavigate } from 'react-router-dom';



export default function DocumentationPad(props) {

    const navigate = useNavigate();

    return <div className="doc-pad flex-col height-full width-full bg-3">

        {/* header */}
        <div className="flex-row gap-13px padding-21px paddingX-34px justify-between align-items">
            <Button 
                appearance='transparent' 
                onClick={()=>navigate('/home')} 
                icon={<Home24Regular/>}
                style={{padding: '0'}}
            > الصفحة الرئيسية </Button>
        </div>

        {/* documentation area */}
        <div className="doc-area width-100 flex-row items-stretch flex-grow bg-3">
            <DocSide className="width-60"/>
            <LogoSide className="width-40 flex-col"/>
        </div>
    </div>
}



function LogoSide (props) {
    return <div {...props} className={`logo-side ${props.className?? ''}`}>
        <div className='height-50 width-100 justify-center items-end flex-row'><LogoImg src={logo}/></div>
        <div className='height-40 width-100 justify-center items-start flex-row'>
            <h1 className="padding-34px">توثيق مشروع تخرج</h1>
        </div>
    </div>
}