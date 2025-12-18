import React from "react";
import AbstractHomePad from "@components/HomePad/AbstractHomePad";
import { useDispatch, useSelector } from "react-redux";
import { Tab } from "@fluentui/react-components";
import PeopleContentArea from "./SearchProjectContentArea";
import { selectPeopleTab } from "@root/src/store/slices/selectedPeopleTab.slice";


export default function SearchHomePad () {

    const dispatch = useDispatch();

    const selectedSearchTab = useSelector(state => state.selectedSearchTab.value);

    const handleTabSelect = (_, data) => dispatch(selectPeopleTab(data.value)); 

    return <AbstractHomePad
        sideBar={{ 
            title: 'البحث عن', 
            tabs: [
                (<Tab key={1} value={'projects'}>المشاريع</Tab>),
                (<Tab key={2} value={'students'}>الطلبة</Tab>),
                (<Tab key={3} value={'supervisors'}>المشرفين</Tab>)
            ],
            onTabSelect: handleTabSelect,
            selectedValue: selectedSearchTab,
        }}
        contentArea={<PeopleContentArea/>}
    />
}