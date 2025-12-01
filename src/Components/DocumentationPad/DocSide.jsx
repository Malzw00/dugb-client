import { Button } from "@fluentui/react-components";
import { ArrowLeft20Regular, ArrowRight20Regular, Building48Regular, Checkmark20Regular } from "@fluentui/react-icons";
import GeneralDF from './GeneralDF';
import ProjectDF from './ProjectDF';
import ClassificationDF from './ClassificationDF';
import AuthersDF from './AuthersDF';
import ResourcesF from './ResourcesF';
import { useState } from "react";
import { Library32Regular } from "@fluentui/react-icons/fonts";



export default function DocSide (props) {

    const [currentForm, _setCurrentForm] = useState(1);

    let formsNum = 5
    const setCurrentForm = (value) => {_setCurrentForm(value <= 0? 1: value > formsNum? formsNum: value);}
    const prevForm = () => setCurrentForm(currentForm -1);
    const nextForm = () => setCurrentForm(currentForm +1);



    return <div {...props} className={`doc-side paddingB-34px paddingR-34px ${props.className?? ''}`}>
        
        <div className="bg-1 width-100 items-center height-full border-radius-8px flex-col gap-8px">

            {/* Documentation Side Header */}
            <DocSideHeader currentForm={currentForm} prevForm={prevForm}/>
            
            {/* Forms Area */}
            <FormsArea className="flex-grow" currentForm={currentForm}/>

            {/* Submit Button Area */}
            <div className='flex-row items-center justify-end padding-13px width-100'>
                <SubmitButton formsNum={formsNum} currentForm={currentForm} nextForm={nextForm}/>
            </div>
        </div>

    </div>
}

function FormsArea(props) {

    const { currentForm } = props;
    
    const dataFormClass = 'flex-col width-100 gap-13px items-stretch paddingX-13px paddingY-8px';

    return <div {...props} className={`
        forms-area flex-col width-60
        justify-center items-center ${props.className?? ''}
    `}>
        {currentForm === 1 && <GeneralDF className={dataFormClass}/>}
        {currentForm === 2 && <ProjectDF className={dataFormClass}/>}
        {currentForm === 3 && <ClassificationDF className={dataFormClass}/>}
        {currentForm === 4 && <AuthersDF className={dataFormClass}/>}
        {currentForm === 5 && <ResourcesF className={dataFormClass}/>}
    </div>
}



function DocSideHeader ({currentForm, prevForm}) {
    
    const currentFormAsInt = parseInt(currentForm);

    return <div className="doc-side-header width-100 flex-row gap-8px padding-13px items-center paddingX1px">

        {

            currentFormAsInt > 1 && 
            <Button 
                appearance='transparent'
                icon={<ArrowRight20Regular/>}
                style={{padding: '0'}}
                onClick={prevForm}
            /> 
        }

        <span style={{fontSize:'14px'}}>
            {currentFormAsInt === 1 && 'البيانات العامــــة'}
            {currentFormAsInt === 2 && 'بيانات المشروع'}
            {currentFormAsInt === 3 && 'بيانات التصنيف'}
            {currentFormAsInt === 4 && 'بيانات المؤلفين'}
            {currentFormAsInt === 5 && 'موارد المشروع'}
        </span>
    </div>
}


function SubmitButton ({ formsNum, currentForm, nextForm }) {

    return (<>
        {
            currentForm < formsNum &&
            <Button 
                icon={<ArrowLeft20Regular/>} 
                iconPosition="after" 
                appearance="primary" 
                onClick={nextForm}
            >
                التالي
            </Button>
        }
        {
            currentForm === formsNum &&
            <Button 
                icon={<Checkmark20Regular/>} 
                iconPosition="after" 
                appearance="primary" 
                onClick={() => {}}
            >
                توثيق المشروع
            </Button>
        }
    </>)
}