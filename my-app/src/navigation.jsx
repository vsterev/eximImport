import React, { useContext } from 'react';
import { Switch, BrowserRouter, Route } from 'react-router-dom';
import MapBoard from './components/mappings/board';
import MapHotel from './components/mappings/hotel';
import MapTransferType from './components/mappings/transfer-type';
import ErrorPage from './components/core/error-page';
import Login from './components/user/login';
import Logout from './components/user/logout';
import ExcelReader from './ExcelReader_hooks';
import Partner from './components/partner/list';
import UserContext from './utils/userContext';
import UserEdit from './components/user/edit';
import Register from './components/user/register';
const Navigation = () => {
  const { isLogged, user } = useContext(UserContext);
  return (
    <BrowserRouter>
      <Switch>
        {/* <Route path="/map/board" component={MapBoard} /> */}
        <Route path="/map/hotel/:str" render={isLogged ? () => <MapHotel /> : () => <Login />} />
        <Route path="/map/hotel" render={isLogged ? () => <MapHotel /> : () => <Login />} />
        <Route path="/map/board/:str" render={isLogged ? () => <MapBoard /> : () => <Login />} />
        <Route path="/map/board/" render={isLogged ? () => <MapBoard /> : () => <Login />} />
        <Route path="/map/transfer-type/:str" render={isLogged ? () => <MapTransferType /> : () => <Login />} />
        <Route path="/map/transfer-type" render={isLogged ? () => <MapTransferType /> : () => <Login />} />
        <Route path="/partners" render={isLogged ? () => <Partner /> : () => <Login />} />
        <Route path="/user/edit" render={isLogged ? () => <UserEdit /> : () => <Login />} />
        <Route path="/login" component={Login} />
        <Route path="/error" component={ErrorPage} />
        <Route
          path="/register"
          render={
            isLogged && user?.isAdmin
              ? () => <Register />
              : () => <ErrorPage msg={'need admin reight to access this page'} />
          }
        />
        <Route path="/logout" component={Logout} />

        <Route path="/" exact render={isLogged ? () => <ExcelReader /> : () => <Login />} />
        {/* <Route path="*" component={ErrorPage} msg={'Page Not Found'} /> */}
        <Route path="*" render={() => <ErrorPage msg={'Page Not Found - 404'} />} />
        {/* <Route path="*" component={() => <ErrorPage msg={'Page Not Found - 404'} />} /> */}
      </Switch>
    </BrowserRouter>
  );
};
export default Navigation;
