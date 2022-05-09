import { Button } from '@material-ui/core';
import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import iLookServ from '../services/interLook';
import PartnerContext from '../utils/partnerContext';
import DeleteIcon from '@material-ui/icons/Delete';
const Row = ({ k, res, bookOnlyTransfer, actionSelect }) => {
  res.tourists.sort((a, b) => new Date(a.birthDate) - new Date(b.birthDate))
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [ilParams, setIlParams] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [transferTypeId, setTransferTypeId] = useState(undefined);
  const [err, setErr] = useState(null);
  const partner = useContext(PartnerContext).partner.code;

  const history = useHistory();
  // console.log({bookOnlyTransfer}, 'rowComponent')
  const searchAct = (a) => {
    const { checkIn, checkOut, tourists, hotel, pansion, flightIn, flightOut, action, transfer } = a;
    // console.log({ checkIn, checkOut, tourists, hotel, pansion, flightIn, flightOut, action, k, transfer, partner });
    iLookServ
      .searchHotel({ checkIn, checkOut, tourists, hotel, pansion, flightIn, flightOut, action, k, transfer, partner })
      .then((a) => {
        if (a?.arrPrices) {
          setOptions(a.arrPrices);
        }
        if (a?.err) {
          setErr(a.err);
        }
        if (a.transferTypeId) {
          setTransferTypeId(a.transferTypeId);
        }
      })
      .catch(console.log);
  };
  const bookAct = () => {
    setIsLoaded(true);
    const bookParams = {
      checkIn: res.checkIn,
      checkOut: res.checkOut,
      flightIn: res.flightIn,
      flightOut: res.flightOut,
      tourists: res.tourists,
      transfer: res.transfer,
      hotelKey: options[selected]?.hotelKey || res.hotel,
      acKey: options[selected]?.acKey || undefined,
      rtKey: options[selected]?.rtKey || undefined,
      rcKey: options[selected]?.rcKey || undefined,
      pnKey: options[selected]?.pnKey || undefined,
      partnerReservKey: k,
      transferTypeId,
      partner,
      message: res.message,
      bookOnlyTransfer
    };
    // console.log(bookParams);
    iLookServ
      .createReserv(bookParams)
      .then((rs) => {
        if (rs?.err) {
          setErr(rs.err);
          setOptions([]);
          setIsLoaded(false);
          return;
        }
        setIlParams(rs);
        setIsLoaded(false);
      })
      .catch((er) => console.error(er));
  };
  const cancelAct = () => {
    // console.log(k, partner)
    setIsLoaded(true);
    iLookServ
      .cancelReserv({ k, partner })
      .then((res) => {
        setIlParams(res);
        setIsLoaded(false);
      })
      .catch(console.log);
  };
  useEffect(() => {
    if(partner==='eximpl') {
      res.action=actionSelect;
      if(actionSelect==='new'){
        setErr(null);
      }
    }
    if (bookOnlyTransfer === 'no') {
      return searchAct(res);
    }
  }, [res, k, bookOnlyTransfer, actionSelect]);
  return (
    <tr>
      <td>{k}</td>
      <td>{partner === "eximpl" ? actionSelect : res.action}</td>
      <td>
        <Link to="#" onClick={() => history.push(`/map/hotel/${res.hotel}`)}>
          {res.hotel}
        </Link>
      </td>
      <td>{res.roomType}</td>
      <td>{res.accommodation}</td>
      <td>
        <Link to={`/map/board/${res.pansion}`}>{res.pansion}</Link>
      </td>
      <td>{res.checkIn}</td>
      <td>{res.checkOut}</td>
      <td>{res.flightIn}</td>
      <td>{res.flightOut}</td>
      <td>
        {res.tourists.map((el, i) => {
          return (
            <div key={i}>
              {el.gender} {el.name} {el.familyName} - {el.birthDate}, {el.phone}, {el.email}
            </div>
          );
        })}
      </td>
      <td>
        <Link to={`/map/transfer-type/${res.transfer}`}>{res.transfer}</Link>
      </td>
      <td>{res.message}</td>
      {/* <td>bookOnlyTransfer
        <button onClick={() => clickAct(res)}> check</button>
      </td> */}
      <td>
        {/* {!!options?.length > 0 && JSON.stringify(options)} */}
        {!!err && <div style={{ color: 'red', fontWeight: 'bold', fontSize: '13px' }}>{err}</div>}
        {(!!options?.length > 0 && bookOnlyTransfer === 'no') && (
          <select onChange={(e) => setSelected(e.target.value)} disabled={isLoaded || ilParams?.reservName}>
            <option value="">please select</option>
            {options?.map((el, i) => {
              return (
                <option key={el.id} value={i}>
                  {el.roomType}
                </option>
              );
            })}
          </select>
        )}
      </td>
      <td style={{ textAlign: 'center' }}>
          {res.action === 'new' && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              disabled={(!selected && bookOnlyTransfer === 'no') || (!!ilParams?.reservName && bookOnlyTransfer === 'no') || (isLoaded && bookOnlyTransfer === 'no') || (options.length === 0 && bookOnlyTransfer === 'no')}
              onClick={bookAct}>
              book
            </Button>
          )}
          {res.action === 'cancel' && (
            /* {res.action === 'cancel' || actionSelect === 'cancel' && ( */
            <Button
              variant="contained"
              color="secondary"
              size="small"
              startIcon={<DeleteIcon />}
              disabled={err === 'not exists in IL' || !!ilParams?.status || isLoaded}
              onClick={cancelAct}>
              cancel
            </Button>
          )}
      </td>
      <td>
        {isLoaded && `Loading ...`}
        {ilParams?.reservName} - {ilParams?.status}
      </td>
    </tr>
  );
};
export default Row;
