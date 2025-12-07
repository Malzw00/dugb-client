import { configureStore } from "@reduxjs/toolkit";
import userReducer from '@slices/user.slice'; 
import collagesReducer from '@slices/collages.slice'; 
import selectedProjectReducer from '@slices/selectedProject.slice'; 
import projectsReducer from '@slices/projects.slice'; 
import selectedCollageReducer from '@slices/selectedCollage.slice'; 
import categoriesReducer from '@slices/categories.slice'; 
import selectedCategoriesReducer from '@slices/selectedCategories.slice'; 
import searchProjectReducer from '@slices/searchProject.slice'; 
import departmentsReducer from '@slices/departments.slice'; 
import selectedDepartmentReducer from '@slices/selectedDepartment.slice'; 

const store = configureStore({
    reducer: {
        user: userReducer,
        collages: collagesReducer,
        selectedProject: selectedProjectReducer,
        projects: projectsReducer,
        selectedCollage: selectedCollageReducer,
        categories: categoriesReducer,
        selectedCategories: selectedCategoriesReducer,
        searchProject: searchProjectReducer,
        departments: departmentsReducer,
        selectedDepartment: selectedDepartmentReducer,
    }
});

export { store };