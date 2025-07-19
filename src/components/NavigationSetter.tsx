import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setNavigate } from '../utils/navigation';

const NavigationSetter = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return null; // This component doesn't render anything visible
};

export default NavigationSetter;
