import React, { useState, useContext } from 'react';
import { useHistory, useLocation } from 'react-router';
import userServices from '../../../services/user';
import UserContext from '../../../utils/userContext';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import styles from './login.module.css';
import PageTemplate from '../../template';
const Login = () => {
  const useStyles = makeStyles((theme) => ({
    avatar: {
      margin: theme.spacing(0),
      backgroundColor: theme.palette.secondary.main,
    },
  }));
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [err, setErr] = useState(null);
  const { logIn } = useContext(UserContext);
  const submitHandler = (e) => {
    e.preventDefault();
    userServices
      .login({ email, password })
      .then((res) => {
        const { token, userData } = res;
        if (token) {
          document.cookie = `sbi-token=${token}; path=/`;
          setErr(null);
          logIn(userData);
        }
        // if (userData) {
        //   logIn(userData);
        // }
        if (location.pathname === '/login') {
          history.push('/');
        }
      })
      .catch((err) => {
        console.error(`a sega tuk`, err);
        setErr(err.message);
      });
  };
  return (
    <PageTemplate title={''}>
      <div className={styles.login}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <form onSubmit={submitHandler} className={styles.login}>
          {/* <label htmlFor="email">email</label>
        <input type="text" id="email" onChange={(e) => setEmail(e.target.value)} /> */}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
          {/* <label htmlFor="password">password</label>
        <input type="password" id="password" onChange={(e) => setPassword(e.target.value)} /> */}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* <button>Login</button> */}
          <Button type="submit" fullWidth variant="contained" color="primary" className={styles.login}>
            Sign In
          </Button>
        </form>
        {err && <div>{err}</div>}
      </div>
    </PageTemplate>
  );
};
export default Login;
