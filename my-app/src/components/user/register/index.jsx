import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import userServices from '../../../services/user';
import styles from './register.module.css';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
const Register = ({ setListRefresh }) => {
  const [params, setParams] = useState({ name: '', email: '', password: '', rePassword: '', isAdmin: false });
  const [err, setErr] = useState({ email: null, password: null, rePassword: null });

  const changeHandler = (e) => {
    // e.preventDefault();
    let { name, value } = e.target;
    console.log(name, value);
    if (name === 'isAdmin') {
      value = e.target.checked;
    }
    console.log('tuuuuuuk eeeeeeeee', { [name]: value });
    setParams({ ...params, [name]: value });
    if (e.target.name === 'rePassword') {
      if (e.target.value === params.password) {
        setErr({ ...err, rePassword: '' });
      }
    }
  };
  const submitHandler = (e) => {
    e.preventDefault();
    if (params.password !== params.rePassword) {
      return setErr({ ...err, rePassword: 'Password mismatch, try gain!' });
    }
    const { name, email, password, isAdmin } = params;

    userServices
      .register({ name, email, password, isAdmin })
      .then((rs) => {
        // const { token, userData } = rs;
        // if (token && userData) {
        //   document.cookie = `sbi-token=${token}; path=/`;
        //   history.push('/');
        //   logIn(userData);
        // }
        if (rs.token) {
          console.log('new user added');
          setListRefresh(true);
          setParams({ name: '', email: '', password: '', rePassword: '', isAdmin: false });
        } else {
          console.log(rs.msg);
        }
      })
      .catch((err) => console.log('Error', err));
  };
  const validation = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    if (name === 'email') {
      if (!RegExp(/.+@.+\..+/).test(value)) {
        return setErr({ ...err, email: 'invalid mail format' });
      }
      return setErr({ ...err, email: '' });
    } else if (name === 'password') {
      if (!RegExp(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){6,16}$/).test(value)) {
        return setErr({
          ...err,
          password: 'invalid password format - minimum 6 symbols, at least one capital letter and one special symbol',
        });
      }
      return setErr({ ...err, password: '' });
    }
    //  else if (name === 'rePassword') {
    //   //   console.log(e.target.onfocus);
    //   if (params.password !== params.rePassword) {
    //     return setErr({
    //       ...err,
    //       rePassword: 'password mismatch',
    //     });
    //   }
    //   return setErr({ ...err, rePassword: '' });
    // }
  };
  return (
    <React.Fragment>
      {/* <div style={{ textAlign: 'center', margin: '10px auto' }}>Admin access rights</div> */}
      <form onSubmit={submitHandler} className={styles.register}>
        <fieldset>
          <legend>add new user</legend>
          <div className={styles.register}>
            <label htmlFor="name" style={{ paddingLeft: '10px' }}>
              Name:{' '}
            </label>
            <input type="text" name="name" id="name" value={params.name} onChange={changeHandler} />
            <label htmlFor="email">Email: </label>
            <input
              type="text"
              name="email"
              id="email"
              onBlur={validation}
              value={params.email}
              onChange={changeHandler}
            />
            {!!err.email && <div>{err.email}</div>}
            <label htmlFor="password">Password: </label>
            <input
              type="password"
              name="password"
              id="password"
              onBlur={validation}
              value={params.password}
              onChange={changeHandler}
            />
            {!!err.password && <div>{err.password}</div>}
            <label htmlFor="rePassword">Re-password: </label>
            <input
              type="password"
              name="rePassword"
              id="rePassword"
              //   onBlur={validation}
              onBlur={validation}
              value={params.rePassword}
              onChange={changeHandler}
              //   onFocus={changeHandler}
            />
          </div>
          <div className={styles.reg}>
            {!!err.rePassword && <div>{err.rePassword}</div>}
            <div>
              <label htmlFor="isAdmin">admin access: </label>
              <input
                type="checkbox"
                id="isAdmin"
                name="isAdmin"
                value={params?.isAdmin}
                // checked={params?.isAdmin}
                onChange={changeHandler}
                // defaultValue={params.isAdmin}
              />
            </div>
            {/* <button disabled={!params.name || err.email || err.password || !params.rePassword}>Submit</button> */}
            <Button
              variant="outlined"
              color="primary"
              type="submit"
              size="small"
              startIcon={<PlaylistAddIcon />}
              disabled={!params.name || err.email || err.password || !params.rePassword}>
              add user
            </Button>
          </div>
        </fieldset>
      </form>
      {/* {<div>{JSON.stringify(params)}</div>} */}
    </React.Fragment>
  );
};
export default Register;
