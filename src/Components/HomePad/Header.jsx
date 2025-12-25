import { Button, Tab, TabList } from "@fluentui/react-components";
import { UserBtn } from "@components/HomePad/UserBtn";
import LogoImg from "@resources/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { selectHeaderTab } from "@root/src/store/slices/selectedHeaderTab.slice";
import { useNavigate } from "react-router-dom";
import { Search16Regular, Search20Regular } from "@fluentui/react-icons";

export default function Header () {

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const selectedHeaderTab = useSelector(state => state.selectedHeaderTab.value);
    
    const user = useSelector(state => state.user.value);
    const isAdmin = user?.role !== 'user';

    const handleTabSelect = (_, data) => dispatch(selectHeaderTab(data.value));

    return (
        <div className="header" style={{
            padding: '8px 5%',
            justifyContent: 'space-between'
        }}>
            
            <div className="flex-row items-center justify-center gap-13px">
                <img src={LogoImg} height={34}/>
                <a onClick={() => navigate('/intro')}>
                    <h4>
                        منصة توثيق مشاريع التخرج الجامعية
                    </h4>
                </a>  
            </div>         

            <TabList 
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 2%' }} 
                selectedValue={selectedHeaderTab} onTabSelect={handleTabSelect}>
                    
                <Tab title='بحث' icon={<Search20Regular/>} value={'search'}/>
                <Tab value='projects'>المشاريع</Tab>
                <Tab value='categories'>الفئات</Tab>
                <Tab value='people'>الطلبة والمشرفين</Tab>
                {isAdmin && <Tab value='control'>لوحة التحكم</Tab>}
            </TabList>

            <UserBtn/>
        </div>
    );
}