import * as React from 'react';
import {
    TabList,
    Tab,
} from '@fluentui/react-components';
import LogoImg from '@components/PreMadeComponents/LogoImg';
import logo from '@resources/logo.png';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCollages } from '@services/collage'
import { setCollages } from '@slices/collages.slice';
import { selectCollage } from '@slices/selectedCollage.slice';
import { setCategories } from '@slices/categories.slice';
import { setSideBarContent } from '@slices/sideBarContent.slice';
import { getCategories } from '@root/src/services/category';
import { selectCategory } from '@root/src/store/slices/selectedCategory.slice';



export default function SideBar() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const collages = useSelector(state => state.collages.value);
    const categories = useSelector(state => state.categories.value);
    const sideBarContent = useSelector(state => state.sideBarContent.value);
    const selectedCollage = useSelector(state => state.selectedCollage.value);
    const selectedCategory = useSelector(state => state.selectedCategory.value);

    const handleCollageTabSelect = function (_, data) {
        const new_val = data.value?? 0;
        dispatch(selectCollage(new_val));
        localStorage['selectedCollage'] = new_val;
    }
    
    const handleCategoryTabSelect = function (_, data) {
        
    }

    const handleSwitchSideBarContent = function (_, data) {
        dispatch(setSideBarContent(data.value?? 'collage'));
    }
    
    // load and set Collages
    React.useEffect(() => {

        if(sideBarContent === 'collages')
        getAllCollages({}).then(res => {
            
            const collages = res?.data?.result?? [];

            dispatch(setCollages(collages));
            
            const savedId = Number(localStorage.getItem("selectedCollage"));

            const selectedCollageObj = collages.find(collage => collage.collage_id === savedId);

            dispatch(selectCollage(selectedCollageObj?.collage_id ?? collages[0].collage_id));

        }).catch(_ => {
            dispatch(setCollages([]));
        });
        
        if(sideBarContent === 'categories')
        getCategories({ collageId: selectedCollage }).then(res => {
    
            const categories = res?.data?.result?? [];

            dispatch(setCategories(categories));

            dispatch(selectCategory(categories[0].category_id?? 0));
        
        }).catch(_ => {
            dispatch(setCategories)
        })
    }, [sideBarContent]);

    return (
        <div className = 'sidebar'>
            
            <div className='logo-caption-div'>
                <LogoImg src={logo}/>
                <h4 onClick={() => navigate('/intro')}>منصة توثيق مشاريع التخرج الجامعية</h4>
            </div>

            <TabList 
                selectedValue={sideBarContent} 
                className='border-radius-5px' style={{ 
                    background: 'rgba(0,0,0,0.06)',
                    height: '34px',
                    justifyContent: 'center',
                }}
                onTabSelect={handleSwitchSideBarContent}>
                    
                <Tab value='collages' style={{width:'50%'}}> الكليات </Tab>
                <Tab value='categories' style={{width:'50%'}}> الفئات </Tab>
            </TabList>

            {sideBarContent === 'collages' &&
            <SideBarContentTabList 
                selected={selectedCollage}
                handleTabSelect={handleCollageTabSelect}
                content={collages.map((collage, index) => (
                    <Tab 
                        key={index}
                        className='collage-tab' 
                        value={collage.collage_id}>
                        
                        {collage.collage_name}
                    </Tab>
                ))}
            />}
            
            {sideBarContent === 'categories' && 
            <SideBarContentTabList 
                selected={selectedCategory}
                handleTabSelect={handleCategoryTabSelect}
                content={categories.map((category, index) => (
                    <Tab 
                        key={index}
                        className='collage-tab' 
                        value={category.category_id?? 0}>
                            
                        {category.category_name?? ''}
                    </Tab>
                ))}
            />}
          </div>
    );
}



function SideBarContentTabList({ content, selected, handleTabSelect }) {

    return <TabList 
        className={`collages-tablist`}
        vertical
        selectedValue={selected}
        onTabSelect={handleTabSelect}>

        {content}
    </TabList>
}