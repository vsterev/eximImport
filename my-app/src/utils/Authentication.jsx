import React, { useEffect, useState } from 'react';
import userServices from '../services/user';
import parseCookie from './parseCookie';
import UserContext from './userContext';

const Authentication = (props) => {
  const [isLogged, setIslogged] = useState(null);
  const [user, setUser] = useState(null);

  function logIn(us) {
    setIslogged(true);
    setUser(us);
  }
  const logOut = () => {
    document.cookie = 'sbi-token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    setIslogged(false);
    setUser(null);
  };
  useEffect(() => {
    const token = parseCookie('sbi-token');
    if (!token) {
      logOut();
      return;
    }
    userServices
      .verify(token)
      .then((data) => {
        console.log(data.userData);
        if (data.userData) {
          logIn(data.userData);
          return;
        }
        logOut();
        return;
      })
      .catch((err) => console.error(`Problem verifying token ${err}`));
  }, []);
  if (isLogged === null) {
    return <div>Loading ...</div>;
  }
  return <UserContext.Provider value={{ isLogged, user, logIn, logOut }}>{props.children}</UserContext.Provider>;
};
export default Authentication;
