import React, { useContext, useState } from 'react';
import parseCookie from '../../../utils/parseCookie';
import PartnerContext from '../../../utils/partnerContext';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import styles from './row.module.css';
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    margin: '0 0 0 20px',
  },
}));

const Rows = ({ selected, setSearchedArr, searchedArr, service, serviceStr }) => {
  const classes = useStyles();
  const { partner } = useContext(PartnerContext);
  const [openSnack, setOpenSnack] = useState(false);
  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnack(false);
  };
  // useEffect(() => {
  //   setSearchedArr(searchedArr);
  // }, [partner]);
  const changeHandler = (e) => {
    const index = e.target.name;
    const value = e.target.value;
    const tempBoards = [...searchedArr];
    if (!tempBoards[index].hasOwnProperty('partnersCode')) {
      tempBoards[index]['partnersCode'] = { [partner.code]: value };
    } else {
      tempBoards[index]['partnersCode'][partner.code] = value;
    }
    setSearchedArr(tempBoards);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    const toSend = searchedArr
      .map((el) => {
        if (el['partnersCode'] && el['partnersCode'][partner.code]) {
          return { _id: el._id, [partner.code]: el['partnersCode'][partner.code] };
        }
        return null;
      })
      .filter((a) => a);
    const token = parseCookie('sbi-token');
    service
      .updateMany(toSend, token)
      .then((result) => {
        setOpenSnack(true);
      })
      .catch(console.log);
  };
  return (
    <React.Fragment>
      {!partner && <h2 className={styles.selectError}>Please select a partner first</h2>}
      {searchedArr && partner ? (
        <form onSubmit={submitHandler}>
          <div className={styles.rows}>
            {searchedArr?.map((el, i) => {
              const holder = `enter ${partner.code} code`;
              // console.log(el);
              return (
                <div key={el._id} className={classes.row}>
                  {el._id}, {el.name}, {el.code},{serviceStr === 'hotels' ? el.resort : ''}{' '}
                  {/* <input type="text" name={i} value={el[partner.code]} placeholder={holder} onChange={changeHandler} /> */}
                  <TextField
                    type="text"
                    // id="standard-basic"
                    // label={serviceStr}
                    // variant="outlined"
                    value={el.partnersCode?.[partner.code]}
                    // value={el[partner.code]}
                    onChange={changeHandler}
                    placeholder={holder}
                    name={i.toString()}
                    className={classes.input}
                  />
                </div>
              );
            })}
            {/* <button>Submit</button> */}
            <Button
              variant="contained"
              color="primary"
              // size="small"
              className={classes.button}
              startIcon={<SaveIcon />}
              type="submit">
              Save
            </Button>
          </div>
        </form>
      ) : (
        partner && <div className={styles.loading}>Loading ...</div>
      )}
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={openSnack}
        autoHideDuration={4000}
        onClose={handleSnackClose}
        // message={messageInfo}
        // action={
        //   <Alert variant="filled" severity="success">
        //     Mapping updated successufuly
        //   </Alert>
        // }
      >
        <Alert variant="filled" severity="success">
          Mapping updated successufuly
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};
export default Rows;
