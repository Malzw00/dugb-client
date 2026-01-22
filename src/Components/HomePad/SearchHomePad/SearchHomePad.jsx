import React from "react";
import AbstractHomePad from "@components/HomePad/AbstractHomePad";
import { useDispatch, useSelector } from "react-redux";
import { Tab } from "@fluentui/react-components";
import { selectHeaderTab } from "@root/src/store/slices/selectedHeaderTab.slice";
import { useNavigate, useSearchParams } from "react-router-dom";


export default function SearchHomePad ({ contentarea }) {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('keyword');

    const selectedSearchTab = useSelector(state => state.selectedSearchTab.value);

    React.useEffect(() => {
        dispatch(selectHeaderTab('search'));
    }, []);

    const handleTabSelect = (_, data) => {
        navigate(`/home/search/${data.value}${(keyword && `?keyword=${keyword}`)?? ''}`);
    }

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
        contentArea={contentarea}
    />
}