import React, { useState, useEffect, useContext } from 'react';
import Search from '../shared/search';
import Rows from '../shared/rows';
import Template from '../../template';
import Button from '@material-ui/core/Button';
import service from '../../../services/transferTypes';
import { useParams, useHistory } from 'react-router-dom';
import PartnerContext from '../../../utils/partnerContext';
import styles from './transfer-type.module.css';
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

const TransferTypeMapping = () => {
  const classes = useStyles();
  const history = useHistory();
  const [transferTypes, setTransferTypes] = useState([]);
  const [searchedTransferTypes, setSearchedTransferTypes] = useState([]);
  const [refreshStay, setRefreshStay] = useState(false);
  const [transferType, setTransferType] = useState('');
  const { str } = useParams();
  const { partner } = useContext(PartnerContext);
  // const { user } = useContext(UserContext);
  const [openSnack, setOpenSnack] = useState(false);

  useEffect(() => {
    if (str) {
      console.log('useefect change strBoard', str);
      setTransferType(str);
    }
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
    <Template title={`Transfer types mapping for ${partner.name}`}>
      {/* <div> */}
      {/* <h2>Mapping transfer typrs for partner - {partner.name} </h2> */}
      {/* {user?.isAdmin && <PartnerSelectNew />} */}
      {/* <PartnerSelect
        selected={partner}
        setSelected={setPartner}
        setInitialArr={setTransferTypes}
        setSearchedArr={setSearchedTransferTypes}
        setSearched={setTransferType}
        type="Transfer types"
      /> */}
      <section className={styles.search}>
        {/* <button onClick={syncHandler}>synchronize transfer types with IL</button> */}
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
          selected={partner.code}
          searchedArr={searchedTransferTypes} //searchedArr
          setSearchedArr={setSearchedTransferTypes} //setSearchedArr
          initialArr={transferTypes} //initialArr
          setInitialArr={setTransferTypes} //setInitialArr
          searchedStr={transferType} //searchedStr
          setSearchedStr={setTransferType} // setSearchedStr
          service={service}
          serviceStr="transferTypes"
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
          synchronize transfer types with IL
        </Button>
      </section>
      <Rows
        selected={partner.code}
        setSearchedArr={setSearchedTransferTypes}
        searchedArr={searchedTransferTypes}
        service={service}
      />
      {/* <BoardRows selected={selected} setSearchedBoards={setSearchedBoards} searchedBoards={searchedBoards} />
      {selected ? <div>{selected}</div> : <div>none</div>}
      {boards && JSON.stringify(boards)} */}
      {/* </div> */}
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
          Transfer types are synched with InterLook
        </Alert>
      </Snackbar>
    </Template>
  );
};
export default TransferTypeMapping;
