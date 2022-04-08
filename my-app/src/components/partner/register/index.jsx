import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import styles from './register.module.css';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import parseCookie from '../../../utils/parseCookie';
import partnerServices from '../../../services/partner';
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
const PartnerRegister = ({ setRefreshPartners }) => {
  const [params, setParams] = useState({ partner: '', name: '', user: '', pass: '' });
  const [msg, setMsg] = useState('');
  const token = parseCookie('sbi-token');
  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setMsg(false);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    partnerServices
      .create(params, token)
      .then((rs) => {
        console.log(rs);
        setParams({ partner: '', name: '', user: '', pass: '' });
        setRefreshPartners(true);
        if (rs.msg) {
          setMsg(rs.msg);
        }
      })
      .catch(console.log);
  };
  const changeHandler = (e) => {
    const { name, value } = e.target;
    setParams({ ...params, [name]: value });
  };
  return (
    <React.Fragment>
      <form onSubmit={submitHandler} className={styles.register}>
        <fieldset>
          <legend>add new partner</legend>
          <div className={styles.register}>
            <label htmlFor="code" style={{ paddingLeft: '10px' }}>
              Code:{' '}
            </label>
            <input type="text" name="partner" id="code" value={params.partner} onChange={changeHandler} />
            <label htmlFor="name">Name: </label>
            <input type="text" name="name" id="name" value={params.name} onChange={changeHandler} />
            <label htmlFor="user">User: </label>
            <input type="text" name="user" id="user" value={params.user} onChange={changeHandler} />
            <label htmlFor="password">Password: </label>
            <input type="text" name="pass" id="password" value={params.pass} onChange={changeHandler} />
          </div>
          <div className={styles.reg}>
            <Button
              variant="outlined"
              color="primary"
              type="submit"
              size="small"
              startIcon={<PlaylistAddIcon />}
              disabled={!params.name || !params.partner || !params.user || !params.pass}>
              add partner
            </Button>
          </div>
        </fieldset>
      </form>
      <div>{msg}</div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={msg ? true : false}
        autoHideDuration={4000}
        onClose={handleSnackClose}>
        <Alert variant="filled" severity="warning">
          {msg}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};
export default PartnerRegister;
