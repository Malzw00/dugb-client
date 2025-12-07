import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: [
        { 
            project_title: 'منصة توثيق مشاريع التخرج الجامعية', 
            project_description: 'هذا مشروع يهتم بتوثيق المشاريع بشكل رسمي من قبل الجهة الرسمية وتخزينها سحابيا بحيث يمكن الوصول إليها من أي مكان عبر الشبكة، ما يسهل الوصول إلى المشاريع ومراجعتها وتبين التكرار وما إلى ذلك، كذلك يهدف هذا المشروع إلى إثبات الملكية لمشاريع التخرج مما يزيد موثوقيتها.' 
        }
    ],
}

const projectsSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        setProjects(state, action) {
            state.value = action.payload;
        }
    }
});

export const { setProjects, } = projectsSlice.actions;
export default projectsSlice.reducer;