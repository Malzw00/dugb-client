import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SmartStart() {
    
    const navigate = useNavigate();

    useEffect(() => {
        const firstTime = sessionStorage['FstLoad'];

        if (!firstTime)
        navigate('/intro', { replace: true });
    
        else 
        navigate('/home', { replace: true });
    }, []);

    return null;
}

export default SmartStart;
