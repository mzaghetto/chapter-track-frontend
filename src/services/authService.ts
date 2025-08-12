import { getNavigate } from '../utils/navigation';

export const logout = () => {
  localStorage.removeItem('token');
  const navigate = getNavigate();
  if (navigate) {
    navigate('/login');
  }
};
