import '../Styles/AuthPad.css';
import Header from './PreMadeComponents/Header'
import { Button } from '@fluentui/react-components';
import { ArrowRight24Regular } from '@fluentui/react-icons';
import FormsPad from './FormsPad';
import { useNavigate } from 'react-router-dom';



export default function AuthPad() {

    const navigate = useNavigate();

    return (
        <div id='auth-pad'>
            <Header caption='منصة توثيق مشاريع التخرج الجامعية' contentBefore={[
                <Button key={1} icon={<ArrowRight24Regular/>} appearance='subtle' onClick={() => {
                    navigate(-1);
                }}/>
            ]}/>

            <FormsPad/>
        </div>
    )
}