import { Tab, TabList, tokens } from "@fluentui/react-components";

export default function SideBar({ onTabSelect, selectedTab }) {

    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '200px',
        background: tokens.colorNeutralBackground3,
        borderRadius: '5px'
        // borderLeft: `1px solid ${tokens.colorNeutralStroke2}`
    }}>
        <TabList 
            vertical
            onTabSelect={onTabSelect} 
            selectedValue={selectedTab}
            style={{ width: '100%', flex: '1', padding: '13px 0' }}>
            <Tab key={'data'} value={'info'}>المعلومات الأساسية</Tab>
            <Tab key={'team'} value={'team'}>فريق العمل</Tab>
            <Tab key={'files'} value={'files'}>ملفات المشروع</Tab>
            <Tab key={'references'} value={'references'}>المراجع</Tab>
            <Tab key={'categories'} value={'categories'}>الفئات</Tab>
            <Tab key={'keywords'} value={'keywords'}>الكلمات المفتاحية</Tab>
        </TabList>
    </div>
}