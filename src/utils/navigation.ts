import { NavigateFunction } from 'react-router-dom';

let navigate: NavigateFunction | null = null;

export const setNavigate = (navigateInstance: NavigateFunction) => {
  navigate = navigateInstance;
};

export const getNavigate = () => navigate;
