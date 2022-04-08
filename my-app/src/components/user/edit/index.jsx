import React, { useState, useContext, useEffect } from 'react';
import Template from '../../template';
import UserContext from '../../../utils/userContext';
import userServices from '../../../services/user';
import parseCookie from '../../../utils/parseCookie';
import Register from '../register';
import UserList from '../userList';
import PartnersList from '../../partner/list';
import styles from './edit.module.css';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PartnerRegister from '../../partner/register';
const UserEdit = () => {
  const { user, logIn } = useContext(UserContext);
  const [userInfo, setUserInfo] = useState({
    name: '',
    currentPassword: '',
    newPassword: '',
    email: '',
    isAdmin: '',
  });

  const useStyles = makeStyles((theme) => ({
    margin: {
      margin: theme.spacing(1),
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    accor: {
      width: '82%',
    },
  }));
  const classes = useStyles();

  const [listRefresh, setListRefresh] = useState(false);
  const [refreshPartners, setRefreshPartners] = useState(false);

  const token = parseCookie('sbi-token');
  const nameChange = (e) => {
    e.preventDefault();
    console.log('context', user);
    console.log('state', userInfo);
    userServices
      .nameChange(token, { name: userInfo.name })
      .then((response) => {
        console.log(response);
        logIn({ ...user, name: userInfo.name });
      })
      .catch(console.log);
  };
  const passwordChange = (e) => {
    e.preventDefault();
    userServices
      .passChange(token, { oldPassword: userInfo.currentPassword, password: userInfo.newPassword })
      .then((rs) => console.log(rs))
      .catch(console.log);
  };
  const changeHandler = (e) => {
    let { name, value } = e.target;
    if (name === 'isAdmin') {
      value = e.target.checked;
    }
    // console.log(e.target.checked);
    // if (value) {
    setUserInfo({ ...userInfo, [name]: value });
    // }
  };
  useEffect(() => {
    setUserInfo({ ...userInfo, email: user?.email, name: user?.name, isAdmin: user?.isAdmin });
  }, [user]);
  return (
    <React.Fragment>
      <Template title="User profile Page">
        {/* <div>User Edit</div> */}
        <div className={styles.edit}>
          <fieldset className={styles.edit}>
            <legend>user info</legend>
            <label htmlFor="email" className={styles.edit}>
              email:{' '}
            </label>
            <input
              type="text"
              id="email"
              value={userInfo?.email}
              name="email"
              disabled
              style={{ width: '25%', alignSelf: 'center' }}
            />

            <form onSubmit={nameChange}>
              <fieldset>
                <legend>name change</legend>
                <label htmlFor="name">name:</label>
                <input type="text" id="name" value={userInfo?.name} name="name" onChange={changeHandler} />
                {/* <button>submit</button> */}
                <Button
                  variant="outlined"
                  color="primary"
                  type="submit"
                  size="small"
                  className={classes.margin}
                  startIcon={<SaveIcon />}>
                  save
                </Button>
              </fieldset>
            </form>
            <form onSubmit={passwordChange}>
              <fieldset>
                <legend>passsword change</legend>
                <label htmlFor="currentPassword">current pasword:</label>
                <input
                  type="password"
                  id="currentPassword"
                  value={userInfo?.currentPassword}
                  name="currentPassword"
                  onChange={changeHandler}
                />
                <label htmlFor="newPassword">new pasword:</label>
                <input
                  type="password"
                  id="newPassword"
                  value={userInfo?.newPassword}
                  name="newPassword"
                  onChange={changeHandler}
                />
                {/* <button>submit</button> */}
                <Button
                  variant="outlined"
                  color="primary"
                  type="submit"
                  size="small"
                  startIcon={<SaveIcon />}
                  className={classes.margin}>
                  save
                </Button>
              </fieldset>
            </form>
          </fieldset>
          {/* <label htmlFor="isAdmin">admin access:</label> */}
          {/* <input
          id="isAdmin"
          type="checkbox"
          value={userInfo?.isAdmin}
          name="isAdmin"
          onClick={changeHandler}
          defaultChecked={user?.isAdmin}
        /> */}
          {/* <div>{JSON.stringify(userInfo)}</div> */}
          {userInfo.isAdmin && (
            <React.Fragment>
              <h2>Admin Panel</h2>
              {/* <div onClick={() => setViewUsers(!viewUsers)}>users managment</div> */}
              <Accordion className={classes.accor}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                  <Typography className={classes.heading}>user accounts</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div style={{ margin: '0 auto', width: '80%' }}>
                    <Register setListRefresh={setListRefresh} />
                    <UserList listRefresh={listRefresh} setListRefresh={setListRefresh} />
                  </div>
                </AccordionDetails>
              </Accordion>
              <Accordion className={classes.accor}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
                  <Typography className={classes.heading}>partner accounts</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div style={{ margin: '0 auto', width: '100%' }}>
                    <PartnerRegister setRefreshPartners={setRefreshPartners} />
                    <PartnersList refreshPartners={refreshPartners} setRefreshPartners={setRefreshPartners} />
                  </div>
                </AccordionDetails>
              </Accordion>
            </React.Fragment>
          )}
          {/* {userInfo.isAdmin && <Partner />} */}
        </div>
      </Template>
    </React.Fragment>
  );
};
export default UserEdit;
