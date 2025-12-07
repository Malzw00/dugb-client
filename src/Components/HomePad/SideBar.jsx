import * as React from 'react';
import {
    Input,
    TabList,
    Tab,
} from '@fluentui/react-components';
import { Search20Regular } from '@fluentui/react-icons';
import LogoImg from '@components/PreMadeComponents/LogoImg';
import logo from '@resources/logo.png';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';



export default function SideBar() {

    const navigate = useNavigate();
    
    const collages = useSelector(state => state.collages.value);

    
    // React.useEffect(() => {
    //     // load and set Collages
    // }, []);

    return (
        <div className = 'sidebar'>
            
            <div className='logo-caption-div'>
                <LogoImg src={logo}/>
                <h4 onClick={() => navigate('/intro')}>منصة توثيق مشاريع التخرج الجامعية</h4>
            </div>

            <Input contentBefore={<Search20Regular/>} placeholder="بحث عن كلية" />
      
            <TabList vertical defaultSelectedValue={1}>
                {collages.map(collage => (
                    <Tab key={collage.id} value={collage.collage_id}>{collage.collage_name}</Tab>
                ))}
            </TabList>
          </div>
    );
}