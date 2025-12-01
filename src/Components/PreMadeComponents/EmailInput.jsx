import { Input } from '@fluentui/react-components';
import {
    Mail20Regular,
} from '@fluentui/react-icons';
// import { useEffect, useState } from 'react';


export default function EmailInput(props) {

    return <Input
        contentBefore={<Mail20Regular />}
        type='email'
        placeholder={props.placeholder?? 'البريد الإلكتروني'} 
        {...props}
    />;
}
