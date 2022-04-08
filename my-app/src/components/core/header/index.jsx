import React, { useContext } from 'react';
// import getNavigationLinks from '../../../functions/navLinks';
import { Link } from 'react-router-dom';
import UserContext from '../../../utils/userContext';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import styles from './header.module.css';
const HeaderComponent = () => {
  const { user } = useContext(UserContext);
  // const links = getNavigationLinks(loggedIn, user);
  return (
    <div className={styles.head}>
      {/* <AppBar position="static" color="transparent"> */}
      <div className={styles.navigationwrap}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div className={styles.navigation}>
            SBIEP - Solvex Exim Poland Importer <p>ver 1.5</p>
          </div>
        </Link>
        {!!user?.email && (
          <div className={styles.name}>
            user: {'\t'}
            <Link to="/user/edit">{user?.name}</Link>
          </div>
        )}
        {!!user?.email && (
          <Link to="/logout">
            <ExitToAppIcon />
          </Link>
        )}

        {/* <Toolbar className={styles.navigation}> */}
        {/* {links.map((currLink, i) => {
              return (
                <Button
                  key={i}
                  component={Link}
                  variant="outlined"
                  color="primary"
                  to={currLink.path}
                  className={styles.navigation}>
                  {currLink.title}
                </Button>
              );
            })} */}
        {/* </Toolbar> */}
      </div>
      {/* </AppBar> */}
    </div>
  );
};
export default HeaderComponent;
