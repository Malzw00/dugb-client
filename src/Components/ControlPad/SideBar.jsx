import * as React from 'react';
import {
    TabList,
    Tab,
    Button,
} from '@fluentui/react-components';
import LogoImg from '../PreMadeComponents/LogoImg';
import logo from '../../resources/logo.png';
import { useNavigate } from 'react-router-dom';



export default function SideBar(props) {

    const navigate = useNavigate();
    const { setContentArea, contentArea } = props;

    return (
        <div {...props} className = {`sidebar ${props.className?? ''}`}>
            
            <div className='logo-caption-div'>
                <LogoImg src={logo}/>
                <h4 onClick={() => navigate('/intro')}>منصة توثيق مشاريع التخرج الجامعية</h4>
            </div>
      
            <TabList 
                className='tab-list' 
                vertical 
                selectedValue={contentArea}
                onTabSelect={(e, data) => setContentArea(data.value)}
            >
                <Tab key={0} value={'projects'}>المشاريع</Tab>
                <Tab key={1} value={'admins'}>المسؤولين</Tab>
                <Tab key={2} value={'accounts'}>حسابات المستخدمين</Tab>
            </TabList>

            <Button appearance='secondary' onClick={() => navigate('/home')}>العودة إلى الرئيسية</Button>
          </div>
    );
}