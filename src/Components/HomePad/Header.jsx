import { Button, Tab, TabList } from "@fluentui/react-components";
import { UserBtn } from "@components/HomePad/UserBtn";
import LogoImg from "@resources/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { selectHeaderTab } from "@root/src/store/slices/selectedHeaderTab.slice";
import { useNavigate } from "react-router-dom";
import { ArrowRight20Regular, Search20Regular } from "@fluentui/react-icons";

export default function Header ({ disableTabs, color, onBackClick }) {

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const selectedHeaderTab = useSelector(state => state.selectedHeaderTab.value);
    
    const user = useSelector(state => state.user.value);
    const isAdmin = user?.role === 'admin' || user?.role === 'manager';

    const handleTabSelect = (_, data) => {
        navigate(`/home/${data.value}`);
    };

    return (
        <div className="header" style={{
            padding: '8px 5%',
            justifyContent: 'space-between',
            background: color?? 'white'
        }}>

            
            <div className="flex-row items-center justify-center gap-13px">
                {onBackClick && <Button
                    onClick={onBackClick}
                    appearance="subtle"
                    icon={<ArrowRight20Regular/>} 
                    style={{ minWidth: '0', borderRadius: '50em' }}
                    title="العودة"/>}

                <img src={LogoImg} height={34}/>
                <a onClick={() => navigate('/home')}>
                    <h4>
                        منصة توثيق مشاريع التخرج الجامعية
                    </h4>
                </a>  
            </div>         

            {!disableTabs && <TabList 
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 2%' }} 
                selectedValue={selectedHeaderTab} onTabSelect={handleTabSelect}>
                    
                <Tab title='بحث' icon={<Search20Regular/>} value={'search'}/>
                <Tab value='projects'>المشاريع</Tab>
                <Tab value='categories'>الفئات</Tab>
                <Tab value='people'>الطلبة والمشرفين</Tab>
                {isAdmin && <Tab value='control'>لوحة التحكم</Tab>}
            </TabList>}

            <UserBtn/>
        </div>
    );
}