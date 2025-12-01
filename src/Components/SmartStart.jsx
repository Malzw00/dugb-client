import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * تحويل ذكي عند أول فتح للتطبيق:
 * - إذا أول مرة → إلى /intro
 * - غير ذلك → إلى /home
 */
function SmartStart() {
    
    const navigate = useNavigate();

    useEffect(() => {
        const firstTime = sessionStorage['FstLoad'] === 'true';

        if (!firstTime || firstTime === 'false')
        navigate('/intro', { replace: true });
    
        else 
        navigate('/home', { replace: true });
    }, []);

    return null;
}

export default SmartStart;
