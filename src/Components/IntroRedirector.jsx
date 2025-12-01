import IntroPad from './IntroPad';
import { useNavigate } from 'react-router-dom';

function IntroRedirector() {
    
    const navigate = useNavigate();

    const goToHome = () => {
        navigate('/home');
    };

    return <IntroPad onContinue={goToHome} />;
}

export default IntroRedirector;