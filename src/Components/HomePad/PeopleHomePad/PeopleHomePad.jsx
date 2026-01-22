import React from "react";
import AbstractHomePad from "@components/HomePad/AbstractHomePad";
import { useDispatch, useSelector } from "react-redux";
import { Tab } from "@fluentui/react-components";
import PeopleContentArea from "./PeopleContentArea";
import { selectPeopleTab } from "@root/src/store/slices/selectedPeopleTab.slice";
import { selectHeaderTab } from "@root/src/store/slices/selectedHeaderTab.slice";


export default function PeopleHomePad () {

    const dispatch = useDispatch();

    const selectedPeopleTab = useSelector(state => state.selectedPeopleTab.value);

    React.useEffect(() => {
        dispatch(selectHeaderTab('people'));
    }, []);

    const handleTabSelect = (_, data) => dispatch(selectPeopleTab(data.value)); 

    return <AbstractHomePad
        sideBar={{ 
            title: 'الأشخاص', 
            tabs: [
                (<Tab key={1} value={'students'}>الطلبة</Tab>),
                (<Tab key={2} value={'supervisors'}>المشرفين</Tab>)
            ],
            onTabSelect: handleTabSelect,
            selectedValue: selectedPeopleTab,
        }}
        contentArea={<PeopleContentArea/>}
    />
}