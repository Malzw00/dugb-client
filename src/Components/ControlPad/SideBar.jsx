import * as React from 'react';
import {
    TabList,
    Tab,
    Button,
} from '@fluentui/react-components';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectControlPanel } from '@slices/selectedControlPanel.slice';



export default function SideBar(props) {

    const dispatch = useDispatch();

    const selectedControlPanel = useSelector(state => state.selectedControlPanel.value)

    return (
        <div {...props} className = {`sidebar ${props.className?? ''}`}>
      
            <TabList 
                className='tab-list' 
                vertical 
                selectedValue={selectedControlPanel}
                onTabSelect={(e, data) => {dispatch(selectControlPanel(data.value))}}
            >
                <Tab key={1} value={'projects'}>المشاريع</Tab>
                <Tab key={10} value={'collages'}>الكليات</Tab>
                <Tab key={8} value={'departments'}>الأقسام</Tab>
                <Tab key={2} value={'categories'}>الفئات</Tab>
                <Tab key={3} value={'students'}>الطلبة</Tab>
                <Tab key={4} value={'supervisors'}>المشرفين</Tab>
                <Tab key={5} value={'references'}>المراجع</Tab>
                <Tab key={6} value={'files'}>الملفات</Tab>
                <Tab key={9} value={'accounts'}>حسابات المستخدمين</Tab>
            </TabList>
          </div>
    );
}