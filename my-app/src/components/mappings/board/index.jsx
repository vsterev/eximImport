import React, { useEffect, useState, useContext } from 'react';
import Search from '../shared/search';
import Rows from '../shared/rows';
import service from '../../../services/boards';
import { useParams, useHistory } from 'react-router';
import PartnerContext from '../../../utils/partnerContext';
// import UserContext from '../../../utils/userContext';
import Template from '../../template';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import styles from './board.module.css';
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));
const BoardMapping = () => {
  const history = useHistory();
  const classes = useStyles();
  const { partner } = useContext(PartnerContext);
  // const { user } = useContext(UserContext);
  const [refreshStay, setRefreshStay] = useState(false);
  const [boards, setBoards] = useState(null);
  const [searchedBoards, setSearchedBoards] = useState(null);
  const [board, setBoard] = useState('');
  const { str } = useParams();
  const [openSnack, setOpenSnack] = useState(false);

  useEffect(() => {
    if (str) {
      console.log('useefect change strBoard', str);
      setBoard(str);
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
    <Template title={`Board mapping for ${partner.name}`}>
      {/* <div className={styles.board}>
        <h2 className={styles.title}>Mapping boards for partner - {partner.name} </h2> */}

      {/* <PartnerSelect
          selected={partner}
          setSelected={setPartner}
          setInitialArr={setBoards}
          setSearchedArr={setSearchedBoards}
          searchedStr={board}
          setSearched={setBoard}
          type="Board"
        /> */}
      <div className={styles.search}>
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
          initialArr={boards}
          setInitialArr={setBoards}
          setSearchedArr={setSearchedBoards}
          searchedStr={board}
          setSearchedStr={setBoard}
          service={service}
          serviceStr="boards"
          refreshStay={refreshStay}
          setRefreshStay={setRefreshStay}
        />
        {/* <button className={styles.sync} onClick={syncHandler}>
            synchronize boards with IL
          </button> */}
        <Button
          variant="contained"
          color="default"
          className={classes.button}
          // startIcon={<SyncIcon />}
          startIcon={<Icon>sync</Icon>}
          onClick={syncHandler}>
          {' '}
          synchronize boards with IL
        </Button>
      </div>
      <Rows selected={partner.code} setSearchedArr={setSearchedBoards} searchedArr={searchedBoards} service={service} />
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={openSnack}
        autoHideDuration={4000}
        onClose={handleSnackClose}>
        <Alert variant="filled" severity="success">
          Boards are synched with InterLook
        </Alert>
      </Snackbar>
    </Template>
  );
};
export default BoardMapping;
