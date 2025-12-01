import * as React from 'react';
import {
    Input,
    TabList,
    Tab,
} from '@fluentui/react-components';
import { Search20Regular } from '@fluentui/react-icons';
import LogoImg from '../PreMadeComponents/LogoImg';
import logo from '../../resources/logo.png';
import { useNavigate } from 'react-router-dom';



export default function SideBar() {

    const navigate = useNavigate();
    
    const [tabs, setTabs] = React.useState([]);
    
    React.useEffect(() => {
        
        setTabs([
            { id: 1, name: 'كلية الهندسة' },
            { id: 2, name: 'كلية الطب' },
            { id: 3, name: 'كلية العلوم' },
        ]);
    }, []);

    return (
        <div className = 'sidebar'>
            
            <div className='logo-caption-div'>
                <LogoImg src={logo}/>
                <h4 onClick={() => navigate('/intro')}>منصة توثيق مشاريع التخرج الجامعية</h4>
            </div>

            <Input contentBefore={<Search20Regular/>} placeholder="بحث عن كلية" />
      
            <TabList vertical defaultSelectedValue={1}>
                {tabs.map(tab => (
                    <Tab key={tab.id} value={tab.id}>{tab.name}</Tab>
                ))}
            </TabList>
          </div>
    );
}