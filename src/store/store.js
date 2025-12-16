import { configureStore } from "@reduxjs/toolkit";
import userReducer from '@slices/user.slice'; 
import collagesReducer from '@slices/collages.slice'; 
import selectedProjectReducer from '@slices/selectedProject.slice'; 
import projectsReducer from '@slices/projects.slice'; 
import selectedCollageReducer from '@slices/selectedCollage.slice'; 
import categoriesReducer from '@slices/categories.slice'; 
import selectedCategoriesReducer from '@root/src/store/slices/selectedCategory.slice'; 
import searchProjectReducer from '@slices/searchProject.slice'; 
import departmentsReducer from '@slices/departments.slice'; 
import selectedDepartmentReducer from '@slices/selectedDepartment.slice'; 
import dateFilterReducer from '@slices/dateFilter.slice'; 
import semesterReducer from '@slices/semester.slice'; 
import orderReducer from '@slices/order.slice'; 
import sideBarContentReducer from '@slices/sideBarContent.slice'; 

const store = configureStore({
    reducer: {
        user: userReducer,
        collages: collagesReducer,
        selectedProject: selectedProjectReducer,
        projects: projectsReducer,
        selectedCollage: selectedCollageReducer,
        categories: categoriesReducer,
        selectedCategory: selectedCategoriesReducer,
        searchProject: searchProjectReducer,
        departments: departmentsReducer,
        selectedDepartment: selectedDepartmentReducer,
        dateFilter: dateFilterReducer,
        semester: semesterReducer,
        order: orderReducer,
        sideBarContent: sideBarContentReducer,
    }
});

export { store };