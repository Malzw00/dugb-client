import { configureStore } from "@reduxjs/toolkit";
import userReducer from '@slices/user.slice'; 
import collagesReducer from '@slices/collages.slice'; 
import selectedProjectReducer from '@slices/selectedProject.slice'; 
import projectsReducer from '@slices/projects.slice'; 
import selectedCollageReducer from '@slices/selectedCollage.slice'; 
import categoriesReducer from '@slices/categories.slice'; 
import selectedCategoriesReducer from '@slices/selectedCategory.slice'; 
import departmentsReducer from '@slices/departments.slice'; 
import selectedDepartmentReducer from '@slices/selectedDepartment.slice'; 
import dateFilterReducer from '@slices/dateFilter.slice'; 
import semesterReducer from '@slices/semester.slice'; 
import orderReducer from '@slices/order.slice'; 
import personReducer from '@slices/person.slice'; 
import sideBarContentReducer from '@slices/sideBarContent.slice'; 
import searchTextReducer from '@slices/searchText.slice'; 
import searchedProjectsReducer from '@root/src/store/slices/searchedProjects.slice'; 
import searchedStudentsReducer from '@slices/searchedStudents.slice'; 
import searchedSupervisorsReducer from '@slices/searchedSupervisor.slice'; 
import selectedHeaderTabReducer from '@slices/selectedHeaderTab.slice'; 
import selectedPeopleTabReducer from '@slices/selectedPeopleTab.slice'; 
import selectedSearchTabReducer from '@slices/selectedSearchTab.slice'; 
import profileReducer from '@root/src/store/slices/profile.slice'
import selectedControlPanelReducer from '@root/src/store/slices/selectedControlPanel.slice'
import controlDialogReducer from '@root/src/store/slices/controlDialog.slice'
import editReducer from '@root/src/store/slices/edit.slice'

const store = configureStore({
    reducer: {
        user: userReducer,
        collages: collagesReducer,
        selectedProject: selectedProjectReducer,
        projects: projectsReducer,
        selectedCollage: selectedCollageReducer,
        categories: categoriesReducer,
        selectedCategory: selectedCategoriesReducer,
        departments: departmentsReducer,
        selectedDepartment: selectedDepartmentReducer,
        dateFilter: dateFilterReducer,
        semester: semesterReducer,
        order: orderReducer,
        sideBarContent: sideBarContentReducer,
        selectedHeaderTab: selectedHeaderTabReducer,
        selectedPeopleTab: selectedPeopleTabReducer,
        person: personReducer,
        searchText: searchTextReducer,
        searchedProjects: searchedProjectsReducer,
        selectedSearchTab: selectedSearchTabReducer,
        searchedSupervisors: searchedSupervisorsReducer,
        searchedStudents: searchedStudentsReducer,
        profile: profileReducer,
        selectedControlPanel: selectedControlPanelReducer,
        controlDialog: controlDialogReducer,
        edit: editReducer,
    }
});

export { store };