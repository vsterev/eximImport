import React, { useState, useContext } from 'react';
import XLSX from 'xlsx';
// import { make_cols } from './MakeColumns';
import { SheetJSFT } from './types';
import Row from './components/row';
import PartnerContext from './utils/partnerContext';
import Template from './components/template';
import styles from './excelReader.module.css';
import { Button } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import { useHistory } from 'react-router-dom';
import {EximAccommodationSelect} from './components/shared/EximAccommodationSelect';
const ExcelReader = () => {
  const [file, setFile] = useState({});
  const [data, setData] = useState(null);
  const [bookOnlyTransfer, setBookOnlyTransfer] = useState("no")
  const [actionSelect, setActionSelect] = useState("new")
  const history = useHistory();
  // const [cols, setCols] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const { partner } = useContext(PartnerContext);
  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      setFile(files[0]);
      setIsDisabled(false);
    }
  };
  const datePreformat = (d) => {
    // console.log(typeof d)
    if (partner.code === 'exim' && (typeof d === 'number')) {
      console.log('tuk0', d)

      d = d.toString();
      const year = d.substr(0, 4);
      const month = d.substr(4, 2);
      const date = d.substr(6, 2);
      const newDate = new Date(year, month - 1, date).toLocaleDateString('en-CA', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });
      console.log(newDate)
      return newDate;
    }
    if (partner.code === 'exim' && (typeof d !== 'number')) {
      console.log('tuk4', d,{format: d instanceof Date} )
      console.log(d.toLocaleDateString().substring(0,10))
      const [day, month, year] = d.toLocaleDateString('ro').substring(0,10).split('.');
      console.log({ month, day, year})
      return year+'-'+month+'-'+day;
    }
    if (d instanceof Date) {
      console.log('tuk1', d)
      return d.toLocaleDateString('en-CA', { year: 'numeric', month: 'numeric', day: 'numeric' });
    } 
    if (typeof d === 'string'&& partner.code==='eximpl') {
      console.log('tuk2', d, typeof d);
      const [date, month, year] = d.split('.');
      return new Date(year, month - 1, date)
        .toLocaleDateString('en-CA', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        })
    } 
    console.log('tuk3', d)

      // history.push({pathname: '/error', state: {msg: 'invalid template or selected partner'}});
     return history.push('/error', { msg: `invalid template for ${partner.name}` });
    
    // if (d instanceof Date) {
    //   return d.toLocaleDateString('en-CA', { year: 'numeric', month: 'numeric', day: 'numeric' });
    // } else {
    //   console.log(d);
    //   const [date, month, year] = d.split('.');
    //   return new Date(year, month - 1, date).toLocaleDateString('en-CA', {
    //     year: 'numeric',
    //     month: 'numeric',
    //     day: 'numeric',
    //   });
    // }
  };

  const handleFile = () => {
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, {
        type: rABS ? 'binary' : 'array',
        bookVBA: true,
        cellDates: true,
        cellNF: false,
        cellText: false,
        dateNF: 'dd.mm.yyyy',
        // setDelimiter: '.',
      });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      // console.log(ws);
      /* Convert array of arrays */
      const data1 = XLSX.utils.sheet_to_json(ws, { dateNF: 'yyyy.mm.dd', raw: true }).map((row) =>
        Object.keys(row).reduce((obj, key) => {
          // obj[key.trim()] = typeof row[key] === 'string' ? row[key].trim() : row[key];
          partner.code === 'eximpl' ? obj[key] = row[key] : obj[key.trim()] = typeof row[key] === 'string' ? row[key].trim() : row[key];
          if (partner.code === 'exim' && key==='voucher_no' && row['room_id']) { obj[key] = `${obj[key]}${row['room_id']}` }
          return obj;
        }, {})
      );
      /* Update state */
      if (partner.code==='exim' && ! data1[0].hasOwnProperty('voucher_no')) {
        console.log(`${partner.code} tuk handle error`)
        return history.push('/error', { msg: `invalid template for ${partner.name}` });
      }
      if (partner.code==='eximpl' && ! data1[0].hasOwnProperty('BOOKING I')) {
        console.log(`${partner.code} tuk handle error`)
        return history.push('/error', { msg: `invalid template for ${partner.name}` });
      }
      const dataModified = data1.reduce((acc, val) => {
        if (!acc[val[partner?.variablesName?.voucher]]) { 
          acc[val[partner?.variablesName?.voucher]] = {
            hotel: val[partner?.variablesName?.hotel],
            checkIn: datePreformat(val[partner?.variablesName?.checkIn]),
            checkOut: datePreformat(val[partner?.variablesName?.checkOut]),
            // checkIn: val[partner?.variablesName?.checkIn],
            // checkOut: val[partner?.variablesName?.checkOut],
            accommodation: val[partner?.variablesName?.accommodation],
            roomType: val[partner?.variablesName?.roomType],
            pansion: val[partner?.variablesName?.pansion],
            action: val[partner?.variablesName?.action] || 'new',
            tourists: [],
            transfer: val[partner?.variablesName?.transfer] || 'group',
            flightIn: val[partner?.variablesName?.flightIn],
            flightOut: val[partner?.variablesName?.flightOut],
            message: val[partner?.variablesName?.message]
          };
        }
        acc[val[partner?.variablesName?.voucher]].tourists.push({
          name: !val[partner?.variablesName?.familyName]
            ? val[partner?.variablesName?.name].split(' ')[1]
            : val[partner?.variablesName?.name],
          familyName: !val[partner?.variablesName?.familyName]
            ? val[partner?.variablesName?.name].split(' ')[0]
            : val[partner?.variablesName?.familyName],
          gender: val[partner?.variablesName?.gender],
          // birthDate: val[partner?.variablesName?.birthDate] ? val[partner?.variablesName?.birthDate] : undefined,
          birthDate: val[partner?.variablesName?.birthDate]
            ? datePreformat(val[partner?.variablesName?.birthDate])
            : undefined,
          email: val[partner?.variablesName?.email],
          phone: val[partner?.variablesName?.phone],
        });

        return acc;
      }, {});
      // console.log({dataModified});
      setData(dataModified);
      // setCols(make_cols(ws['!ref']));
    };

    if (rABS) {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
    setIsDisabled(true);
  };
  // const clickAct = (a) => {
  //   // console.log(a);
  //   const { checkIn, checkOut, tourists, hotel, pansion } = a;
  //   console.log({ checkIn, checkOut, tourists, hotel, pansion });
  //   iLookServ
  //     .searchHotelServices({ checkIn, checkOut, tourists, hotel, pansion })
  //     .then((a) => {
  //       setOptions(a.arrPrices);
  //     })
  //     .catch(console.log);
  // };

  return (
    <Template
      title={
        !!partner
          ? `Upload an excel Solvex Template to import reservation from ${partner.name}`
          : 'First select a partner for which will import reservations'
      }>
      <div>
        <section className={styles.button}>
          {/* <label htmlFor="partnerSelect">Select a partner: </label>
      <select id="partnerSelect" onChange={(e) => setPartner(e.target.value)} defaultValue={partner}>
        <option value="">please select</option>
        <option value="exim">Exim tours</option>
        <option value="partner2">Partner 2</option>
      </select> */}
          {/* <PartnerSelectNew /> */}
          {/* <label htmlFor="file">
          Upload an excel Solvex Template {!!partner ? `to import reservation from ${partner.name}` : ''}
        </label> */}
          <input type="file" className="form-control" id="file" accept={SheetJSFT} onChange={handleChange} hidden />
          <label htmlFor="file">
            <Button
              component="span"
              variant="contained"
              color="primary"
              disabled={!partner.code}
              startIcon={<CloudUploadIcon />}>
              Upload .xls file
            </Button>
          </label>
          <br />{' '}
          <Button
            component="span"
            variant="contained"
            color="primary"
            onClick={handleFile}
            disabled={isDisabled}
            endIcon={<ImportExportIcon />}>
            IL synchronize
          </Button>
        </section>
        {/* {!!data.length > 0 && JSON.stringify(data)} */}

        {data && (
          <React.Fragment>
            <EximAccommodationSelect 
            bookOnlyTransfer={bookOnlyTransfer} setBookOnlyTransfer={setBookOnlyTransfer}
            actionSelect={actionSelect} setActionSelect={setActionSelect}
            />
            <table>
              <thead>
                <tr>
                  <th>voucher</th>
                  <th>action</th>
                  <th>hotel name</th>
                  <th>room type</th>
                  <th>accomm.</th>
                  <th>pansion</th>
                  <th>checkIn</th>
                  <th>checkOut</th>
                  <th>flightIn</th>
                  <th>flightOut</th>
                  <th>tourists</th>
                  <th>transfer</th>
                  <th>message</th>
                  <th>interLook type</th>
                  <th>send reservation</th>
                  <th>IL response</th>
                  {/* <th>IL status</th> */}
                </tr>
              </thead>
              <tbody>
                {Object.entries(data).map(([k, res]) => {
                  return (
                    // <tr key={k}>
                    //   <td>{k}</td>
                    //   <td>{res.action}</td>
                    //   <td>{res.hotel}</td>
                    //   <td>{res.roomType}</td>
                    //   <td>{res.accommodation}</td>
                    //   <td>{res.pansion}</td>
                    //   <td>{res.checkIn}</td>
                    //   <td>{res.checkOut}</td>
                    //   <td>
                    //     {res.tourists.map((el, i) => {
                    //       return (
                    //         <div key={i}>
                    //           {el.gender} {el.name} {el.familyName} - {el.birthDate}
                    //         </div>
                    //       );
                    //     })}
                    //   </td>
                    //   <td>
                    //     <button onClick={() => clickAct(res)}> check</button>
                    //   </td>
                    //   <td>
                    //     {/* {!!options?.length > 0 && JSON.stringify(options)} */}
                    //     {!!options?.length > 0 && (
                    //       <select>
                    //         {options?.map((el) => {
                    //           return (
                    //             <option key={el.id} value={el}>
                    //               {el.roomType}
                    //             </option>
                    //           );
                    //         })}
                    //       </select>
                    //     )}
                    //   </td>
                    // </tr>
                    <Row key={k} k={k} res={res} bookOnlyTransfer={bookOnlyTransfer} actionSelect={actionSelect} />
                  );
                })}
              </tbody>
            </table>
          </React.Fragment>
        )}
      </div>
    </Template>
  );
};

export default ExcelReader;
