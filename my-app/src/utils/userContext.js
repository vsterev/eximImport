import React from 'react';
const UserContext = React.createContext({
  isLogged: false,
  user: { name: '', email: '', userId: '', isAdmin: false },
  logIn: () => {},
  logOut: () => {},
});
export default UserContext;
