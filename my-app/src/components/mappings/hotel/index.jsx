import React, { useEffect, useState, useContext } from 'react';
import Search from '../shared/search';
import Rows from '../shared/rows';
import service from '../../../services/hotels';
import { useParams, useHistory } from 'react-router-dom';
import PartnerContext from '../../../utils/partnerContext';
import Template from '../../template';
import styles from './hotel.module.css';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));
const HotelMapping = () => {
  const classes = useStyles();
  const [hotels, setHotels] = useState(null);
  const [searchedHotels, setSearchedHotels] = useState(null);
  const [searchedStr, setSearchedStr] = useState({ hotel: '', city: '' });
  const { str } = useParams();
  const history = useHistory();
  const { partner } = useContext(PartnerContext);
  const [openSnack, setOpenSnack] = useState(false);
  const [refreshStay, setRefreshStay] = useState(false);

  useEffect(() => {
    if (str) {
      setSearchedStr({ ...searchedStr, hotel: str });
    }
    // eslint-disable-line react-hooks/exhaustive-deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [str]);
  const syncHandler = () => {
    service
      .sync()
      .then((rs) => {
        setOpenSnack(true);
        setRefreshStay(true);
      })
      .catch(console.log);
  };
  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false);
  };
  return (
    // <div>
    <Template title={`Hotel mapping for ${partner.name}`}>
      <div className={styles.search}>
        {/* <button onClick={() => history.goBack()}>Back</button> */}
        <Button
          variant="contained"
          color="default"
          className={classes.button}
          startIcon={<ArrowBackIosOutlinedIcon />}
          // startIcon={<Icon>back</Icon>}
          onClick={() => history.goBack()}>
          {' '}
          Back
        </Button>
        <Search
          selected={partner}
          searchedArr={searchedHotels} //searchedArr
          setSearchedArr={setSearchedHotels} //setSearchedArr
          initialArr={hotels} //initialArr
          setInitialArr={setHotels} //setInitialArr
          searchedStr={searchedStr} //searchedStr
          setSearchedStr={setSearchedStr} // setSearchedStr
          service={service}
          serviceStr="hotels"
          refreshStay={refreshStay}
          setRefreshStay={setRefreshStay}
        />
        <Button
          variant="contained"
          color="default"
          className={classes.button}
          // startIcon={<SyncIcon />}
          startIcon={<Icon>sync</Icon>}
          onClick={syncHandler}>
          {' '}
          synchronize hotels with IL
        </Button>
      </div>
      <Rows
        selected={partner}
        setSearchedArr={setSearchedHotels}
        searchedArr={searchedHotels}
        service={service}
        serviceStr="hotels"
      />
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={openSnack}
        autoHideDuration={4000}
        onClose={handleSnackClose}>
        <Alert variant="filled" severity="success">
          Hotels are synched with InterLook
        </Alert>
      </Snackbar>
    </Template>
  );
};
export default HotelMapping;
