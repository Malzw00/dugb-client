// import * as React from 'react';
// import {
//     TabList,
//     Tab,
// } from '@fluentui/react-components';
// import LogoImg from '@components/PreMadeComponents/LogoImg';
// import logo from '@resources/logo.png';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { getAllCollages } from '@services/collage'
// import { setCollages } from '@slices/collages.slice';
// import { selectCollage } from '@slices/selectedCollage.slice';
// import { setCategories } from '@slices/categories.slice';
// import { getCategories } from '@root/src/services/category';
// import { selectCategory } from '@root/src/store/slices/selectedCategory.slice';



// export default function SideBar() {

//     const dispatch = useDispatch();
    
//     const collages = useSelector(state => state.collages.value);
//     const categories = useSelector(state => state.categories.value);
//     const selectedHeaderTab = useSelector(state => state.selectedHeaderTab.value);
//     const selectedCollage = useSelector(state => state.selectedCollage.value);
//     const selectedCategory = useSelector(state => state.selectedCategory.value);

//     const handleCollageTabSelect = function (_, data) {
//         const new_val = data.value?? 0;
//         dispatch(selectCollage(new_val));
//         localStorage['selectedCollage'] = new_val;
//     }
    
//     const handleCategoryTabSelect = function (_, data) {
        
//     }
    
//     // load and set Collages
//     React.useEffect(() => {

//         if(selectedHeaderTab === 'projects')
//         getAllCollages({}).then(res => {
            
//             const collages = res?.data?.result?? [];

//             dispatch(setCollages(collages));
            
//             const savedId = Number(localStorage.getItem("selectedCollage"));

//             const selectedCollageObj = collages.find(collage => collage.collage_id === savedId);

//             dispatch(selectCollage(selectedCollageObj?.collage_id ?? collages[0].collage_id));

//         }).catch(_ => {
//             dispatch(setCollages([]));
//         });
        
//         if(selectedHeaderTab === 'categories')
//         getCategories({ collageId: selectedCollage }).then(res => {
    
//             const categories = res?.data?.result?? [];

//             dispatch(setCategories(categories));

//             dispatch(selectCategory(categories[0].category_id?? 0));
        
//         }).catch(_ => {
//             dispatch(setCategories)
//         })
//     }, [selectedHeaderTab]);

//     return (
//         <div className = 'sidebar'>

//             <div>
//                 {
//                     selectedHeaderTab === 'projects' && <h2>الكليات</h2> || 
//                     selectedHeaderTab === 'categories' && <h2>الفئات</h2>
//                 }
//             </div>

//             <br />
            
//             {selectedHeaderTab === 'projects' &&
//             <SideBarContentTabList 
//                 selected={selectedCollage}
//                 handleTabSelect={handleCollageTabSelect}
//                 content={collages.map((collage, index) => (
//                     <Tab 
//                         key={index}
//                         className='collage-tab' 
//                         value={collage.collage_id}>
                        
//                         {collage.collage_name}
//                     </Tab>
//                 ))}
//             />}
            
//             {selectedHeaderTab === 'categories' && 
//             <SideBarContentTabList 
//                 selected={selectedCategory}
//                 handleTabSelect={handleCategoryTabSelect}
//                 content={categories.map((category, index) => (
//                     <Tab 
//                         key={index}
//                         className='collage-tab' 
//                         value={category.category_id?? 0}>
                            
//                         {category.category_name?? ''}
//                     </Tab>
//                 ))}
//             />}
//           </div>
//     );
// }



// function SideBarContentTabList({ content, selected, handleTabSelect }) {

//     return <TabList 
//         className={`collages-tablist`}
//         vertical
//         selectedValue={selected}
//         onTabSelect={handleTabSelect}>

//         {content}
//     </TabList>
// }