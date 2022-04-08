import { useContext, useEffect } from 'react';
import UserContext from '../../../utils/userContext';
import { useHistory } from 'react-router-dom';
const Logout = () => {
  const { logOut } = useContext(UserContext);
  const history = useHistory();
  useEffect(() => {
    logOut();
    history.push('/');
  }, [logOut, history]);
  return null;
};
export default Logout;
