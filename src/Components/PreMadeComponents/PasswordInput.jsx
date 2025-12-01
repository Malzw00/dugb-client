import { Input, Button } from "@fluentui/react-components"
import { 
    Eye24Regular,
    EyeOff24Regular,
    Key20Regular
} from '@fluentui/react-icons';
import { useState } from "react";


export default function PasswordInput (props) {

  const [showPassword, setShowPassword] = useState(false);

    return (
        <Input 
            type={showPassword? 'input':'password'} 
            contentBefore={props?.contentBefore?? <Key20Regular/>} 
            placeholder={props?.placeholder?? 'كلمة السر'}
                contentAfter={
                    <Button
                        style={{}}
                        className='input-inner-btn'
                        size='small'
                        appearance='transparent'
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff24Regular /> : <Eye24Regular />}
                    </Button>
                }
            {...props}
        />
    );
} 