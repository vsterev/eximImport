import React, { useEffect, useState, useContext } from 'react';
import partnerService from '../../../services/partner';
import parseCookie from '../../../utils/parseCookie';
import styles from './partner.module.css';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import { IconButton } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import UserContext from '../../../utils/userContext';

const Partner = ({ setRefreshPartners, refreshPartners }) => {
  const [partners, setPartners] = useState(null);
  const {user}  = useContext(UserContext);
  const [partnerCheckError, setPartnerCheckError] = useState(false);
  const [msg, setMsg] = useState('');
  const [viewTable, setViewTable] = useState('');
  // const [statePartner, setStatePartner] = useState({
  //   voucher: '',
  //   hotel: '',
  //   checkIn: '',
  //   checkOut: '',
  //   accommodation: '',
  //   roomType: '',
  //   pansion: '',
  //   action: '',
  //   tourists: '',
  //   transfer: '',
  //   flightIn: '',
  //   flightOut: '',
  //   name: '',
  //   familyName: '',
  //   gender: '',
  //   birthDate: '',
  //   email: '',
  //   phone: '',
  // });
  const token = parseCookie('sbi-token');
  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setMsg(false);
  };
  useEffect(() => {
    partnerService
      .all(token)
      .then((prts) => {
        setPartners(prts.partners);
        setRefreshPartners(false);
      })
      .catch(console.log);
  }, [token, refreshPartners, setRefreshPartners]);

  const submitHandler = (e, partner) => {
    e.preventDefault();
    partnerService
      .update(partner, token)
      .then((rs) => {
        if (rs._id) {
          console.log(`Information about ${rs.name} was updated`);
        }
        if (rs.msg) {
          setMsg('error saving partner');
        }
      })
      .catch(console.log);
  };
  const changeHandler = (e, i) => {
    e.preventDefault();
    const { name, value } = e.target;
    console.log({ name, value, i });
    const partnersTemp = [...partners];
    const checkError = partners.find((el) => el.partner === e.target.value && e.target.value !== '');
    if (!!checkError) {
      setPartnerCheckError(true);
    } else {
      setPartnerCheckError(false);
    }
    // partnersTemp[i][e.target.name] = e.target.value;
    if (!name.includes('variablesName')) {
      partnersTemp[i][name] = value; //tuk
    } else {
      const preformatName = name.replace('variablesName.', '');
      partnersTemp[i]['variablesName'][preformatName] = value; //tuk
    }
    console.log(partnersTemp);
    setPartners(partnersTemp);
  };
  const expandHandler = (e, val) => {
    if (viewTable === val) {
      setViewTable('');
    } else setViewTable(val);
  };
  const deleteHandler = (e, val) => {
    e.preventDefault();
    const tempPartners = [...partners];
    if (window.confirm('Please conirm to be deleted')) {
      const el = tempPartners.splice(val, 1);
      setPartners(tempPartners);
      partnerService.delete2({ el: el[0] }, token).then(console.log).catch(console.log);
    }
  };

  return (
    <div>
      <form>
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>code</th>
              <th>name</th>
              <th>IL - login</th>
              <th>IL - password</th>
              <th>actions</th>
            </tr>
          </thead>
          <tbody>
            {partners?.map((partner, i) => {
              return (
                <React.Fragment key={i}>
                  <tr style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : 'inherit' }}>
                    <td>
                      <input
                        type="text"
                        name="partner"
                        value={partner.partner}
                        onChange={(e) => changeHandler(e, i)}
                        disabled
                      />
                    </td>
                    <td>
                      <input type="text" name="name" value={partner.name} onChange={(e) => changeHandler(e, i)} />
                    </td>

                    <td>
                      <input type="text" name="user" value={partner.user} onChange={(e) => changeHandler(e, i)} />
                    </td>
                    <td>
                      <input type="text" name="pass" value={partner.pass} onChange={(e) => changeHandler(e, i)} />
                    </td>
                    <td>
                      <IconButton aria-label="save" onClick={(e) => expandHandler(e, i)}>
                        <ExpandMoreIcon fontSize="small" color="primary" />
                      </IconButton>
                      <IconButton aria-label="save" onClick={(e) => submitHandler(e, partner)} 
                      disabled={(partner.partner==="exim"||partner.partner==="eximpl")&&user.email!=='vasil@solvex.bg'}>
                        <SaveIcon fontSize="small" color="default" />
                      </IconButton>
                      <IconButton aria-label="delete" onClick={(e) => deleteHandler(e, i)}
                      disabled={partner.partner==="exim"||partner.partner==="eximpl"}
                      >
                        <DeleteIcon fontSize="small" color="info"/>
                      </IconButton>
                    </td>
                  </tr>
                  {viewTable === i && (
                    <tr style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : 'inherit' }}>
                      <td colSpan="5">
                        <p className={styles.tableName}>excel variables mapping for {partner?.name}</p>
                        <table className={styles.variablesname}>
                          <thead>
                            <tr>
                              <th>voucher</th>
                              <th>hotel</th>
                              <th>checkIn</th>
                              <th>checkOut</th>
                              <th>accommodation</th>
                              <th>roomType</th>
                              <th>pansion</th>
                              <th>action</th>
                              <th>tourists</th>
                              <th>transfer</th>
                              <th>flightIn</th>
                              <th>flightOut</th>
                              <th>name</th>
                              <th>familyName</th>
                              <th>gender</th>
                              <th>birthDate</th>
                              <th>email</th>
                              <th>phone</th>
                              <th>message</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <input
                                  style={{ width: `${partner?.variablesName?.voucher?.length}ch` }}
                                  name="variablesName.voucher"
                                  value={partner?.variablesName?.voucher}
                                  onChange={(e) => changeHandler(e, i)}
                                />
                              </td>
                              <td>
                                <input
                                  style={{ width: `${partner?.variablesName?.hotel?.length}ch` }}
                                  name="variablesName.hotel"
                                  value={partner?.variablesName?.hotel}
                                  onChange={(e) => changeHandler(e, i)}
                                />
                              </td>
                              <td>
                                <input
                                  style={{ width: `${partner?.variablesName?.checkIn?.length}ch` }}
                                  name="variablesName.checkIn"
                                  value={partner?.variablesName?.checkIn}
                                  onChange={(e) => changeHandler(e, i)}
                                />
                              </td>
                              <td>
                                <input
                                  style={{ width: `${partner?.variablesName?.checkOut?.length}ch` }}
                                  name="variablesName.checkOut"
                                  value={partner?.variablesName?.checkOut}
                                  onChange={(e) => changeHandler(e, i)}
                                />
                              </td>
                              <td>
                                <input
                                  style={{ width: `${partner?.variablesName?.accommodation?.length}ch` }}
                                  name="variablesName.accommodation"
                                  value={partner?.variablesName?.accommodation}
                                  onChange={(e) => changeHandler(e, i)}
                                />
                              </td>
                              <td>
                                <input
                                  style={{ width: `${partner?.variablesName?.roomType?.length}ch` }}
                                  name="variablesName.roomType"
                                  value={partner?.variablesName?.roomType}
                                  onChange={(e) => changeHandler(e, i)}
                                />
                              </td>
                              <td>
                                <input
                                  style={{ width: `${partner?.variablesName?.pansion?.length}ch` }}
                                  name="variablesName.pansion"
                                  value={partner?.variablesName?.pansion}
                                  onChange={(e) => changeHandler(e, i)}
                                />
                              </td>
                              <td>
                                <input
                                  style={{ width: `${partner?.variablesName?.action?.length}ch` }}
                                  name="variablesName.action"
                                  value={partner?.variablesName?.action}
                                  onChange={(e) => changeHandler(e, i)}
                                />
                              </td>
                              <td>
                                <input
                                  style={{ width: `${partner?.variablesName?.tourists?.length}ch` }}
                                  name="variablesName.tourists"
                                  value={partner?.variablesName?.tourists}
                                  onChange={(e) => changeHandler(e, i)}
                                />
                              </td>
                              <td>
                                <input
                                  style={{ width: `${partner?.variablesName?.transfer?.length}ch` }}
                                  name="variablesName.transfer"
                                  value={partner?.variablesName?.transfer}
                                  onChange={(e) => changeHandler(e, i)}
                                />
                              </td>
                              <td>
                                <input
                                  style={{ width: `${partner?.variablesName?.flightIn?.length}ch` }}
                                  name="variablesName.flightIn"
                                  value={partner?.variablesName?.flightIn}
                                  onChange={(e) => changeHandler(e, i)}
                                />
                              </td>
                              <td>
                                <input
                                  style={{ width: `${partner?.variablesName?.flightOut?.length}ch` }}
                                  name="variablesName.flightOut"
                                  value={partner?.variablesName?.flightOut}
                                  onChange={(e) => changeHandler(e, i)}
                                />
                              </td>
                              <td>
                                <input
                                  style={{ width: `${partner?.variablesName?.name?.length}ch` }}
                                  name="variablesName.name"
                                  value={partner?.variablesName?.name}
                                  onChange={(e) => changeHandler(e, i)}
                                />
                              </td>
                              <td>
                                <input
                                  style={{ width: `${partner?.variablesName?.familyName?.length}ch` }}
                                  name="variablesName.familyName"
                                  value={partner?.variablesName?.familyName}
                                  onChange={(e) => changeHandler(e, i)}
                                />
                              </td>
                              <td>
                                <input
                                  style={{ width: `${partner?.variablesName?.gender?.length}ch` }}
                                  name="variablesName.gender"
                                  value={partner?.variablesName?.gender}
                                  onChange={(e) => changeHandler(e, i)}
                                />
                              </td>
                              <td>
                                <input
                                  style={{ width: `${partner?.variablesName?.birthDate?.length}ch` }}
                                  name="variablesName.birthDate"
                                  value={partner?.variablesName?.birthDate}
                                  onChange={(e) => changeHandler(e, i)}
                                />
                              </td>
                              <td>
                                <input
                                  style={{ width: `${partner?.variablesName?.email?.length}ch` }}
                                  name="variablesName.email"
                                  value={partner?.variablesName?.email}
                                  onChange={(e) => changeHandler(e, i)}
                                />
                              </td>
                              <td>
                                <input
                                  style={{ width: `${partner?.variablesName?.phone?.length}ch` }}
                                  name="variablesName.phone"
                                  value={partner?.variablesName?.phone}
                                  onChange={(e) => changeHandler(e, i)}
                                />
                              </td>
                              <td>
                                <input
                                  style={{ width: `${partner?.variablesName?.message?.length}ch` }}
                                  message="variablesName.message"
                                  value={partner?.variablesName?.message}
                                  onChange={(e) => changeHandler(e, i)}
                                />
                              </td>
                            </tr>
                            {/* <tr style={{ backgroundColor: 'inherit' }}>
                              <td colSpan="18" style={{ backgroundColor: 'inherit' }}>
                                <button onClick={variablsChange} className={styles.variablesname}>
                                  submit
                                </button>
                              </td>
                            </tr> */}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
        {!!partnerCheckError && <div>dublicated partner code</div>}
      </form>
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
    </div>
  );
};
export default Partner;
