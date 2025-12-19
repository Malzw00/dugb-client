import { useDispatch, useSelector } from "react-redux";
import AbstractHomePad from "@components/HomePad/AbstractHomePad";
import { Tab } from "@fluentui/react-components";
import { selectCollage } from "@root/src/store/slices/selectedCollage.slice";
import React from "react";
import { getAllCollages } from "@root/src/services/collage";
import { setCollages } from "@root/src/store/slices/collages.slice";
import ProjectsContentArea from "./ProjectsContentArea";



export default function ProjectsHomePad () {

    const dispatch = useDispatch();

    const collages = useSelector(state => state.collages.value);
    const selectedCollage = useSelector(state => state.selectedCollage.value);

    const handleTabSelect = (_, data) => dispatch(selectCollage(data.value)); 

    React.useEffect(() => {
        
        getAllCollages()
            .then(res => {
                const collages = res?.data?.result?? []

                dispatch(setCollages(collages))
                
                if(!selectedCollage)
                dispatch(selectCollage(collages[0]?.collage_id?? 0));
            })
            .catch(err => {
                console.log(err);
                alert('Get All Collages Failed');
            })
        
    }, []);

    return <AbstractHomePad
        sideBar={{ 
            title: 'الكليات', 
            tabs: (collages.map((collage, index) => {
                return <Tab key={index} value={collage.collage_id}>
                    {collage.collage_name}
                </Tab>;
            })),
            onTabSelect: handleTabSelect,
            selectedValue: selectedCollage,
        }}
        contentArea={<ProjectsContentArea />}
    />
}