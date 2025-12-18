import React from "react";
import AbstractHomePad from "@components/HomePad/AbstractHomePad";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, Option, Tab } from "@fluentui/react-components";
import { selectCollage } from "@root/src/store/slices/selectedCollage.slice";
import { setCollages } from "@root/src/store/slices/collages.slice";
import { selectCategory } from "@slices/selectedCategory.slice";
import { getCategories } from "@root/src/services/category";
import { getAllCollages } from "@root/src/services/collage";
import { setCategories } from "@root/src/store/slices/categories.slice";
import CategoriesContentArea from "./CategoriesContentArea";



export default function CategoriesHomePad () {

    const dispatch = useDispatch();

    const categories = useSelector(state => state.categories.value);
    const selectedCategory = useSelector(state => state.selectedCategory.value);
    const selectedCollage = useSelector(state => state.selectedCollage.value);

    const handleTabSelect = (_, data) => dispatch(selectCategory(data.value)); 

    React.useEffect(() => {
        
        getCategories({ collageId: selectedCollage })
            .then(res => {
                const categories = res?.data?.result?? []
                dispatch(setCategories(categories))

                if(!selectedCategory)
                dispatch(selectCategory(categories[0]?.collage_id?? 0));
            })
            .catch(err => {
                console.log(err);
                alert('Get All Collages Failed');
            })
        
    }, [selectedCollage,]);

    return <AbstractHomePad
        sideBar={{ 
            title: 'الفئات', 
            tabs: (
                categories.length < 1 && <div className="sidebar-placeholder">
                    لا يوجد فئات في الكلية المحددة
                </div> 
                || categories.map((categories, index) => {
                    return <Tab key={index} value={categories.category_id}>
                        {categories.category_name}
                    </Tab>;
                })
            ),
            headerNode: (<CollagesDropdown/>),
            onTabSelect: handleTabSelect,
            selectedValue: selectedCategory,
        }}
        contentArea={<CategoriesContentArea/>}
    />
}



function CollagesDropdown ({}) {

    const dispatch = useDispatch();
    const collages = useSelector(state => state.collages.value || []);
    
    const selectedCollage = useSelector(state => state.selectedCollage.value);

    const handleCollageSelect = (_, data) => {
        if (data.optionValue) {
            dispatch(selectCollage(data.optionValue));
        }
    };

    React.useEffect(() => {

        if(!collages.length)
        getAllCollages()
            .then(res => {
                
                const collages = res?.data?.result || [];

                dispatch(setCollages(collages));
                
                if(!selectedCollage)
                dispatch(selectCollage(collages[0]?.collage_id?? 0));
            })
            .catch(err => console.log('Error fetching collages:', err));
    }, []);

    const selectedCollageName = collages?.map(collage => 
        collage.collage_id === selectedCollage && collage.collage_name
    );

    return (
        <Dropdown
            placeholder="الكليات"
            style={{ minWidth: '100px' }}
            selectedOptions={selectedCollage ? [selectedCollage] : []}
            value={selectedCollageName}
            onOptionSelect={handleCollageSelect}
        >
            {collages.length > 0 ? (
                collages.map((collage, index) => (
                    <Option key={index} value={collage.collage_id}>
                        {collage.collage_name}
                    </Option>
                ))
            ) : (
                <Option disabled>لا توجد كليات</Option>
            )}
        </Dropdown>
    );
}