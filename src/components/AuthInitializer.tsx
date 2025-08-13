import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { setOnTokenRefreshedCallback } from '../services/api';

const AuthInitializer = () => {
  const { login } = useAuth();

  useEffect(() => {
    setOnTokenRefreshedCallback(login);
  }, [login]);

  return null; // This component doesn't render anything
};

export default AuthInitializer;
