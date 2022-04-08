import React, { useEffect } from 'react';
import parseCookie from '../../../utils/parseCookie';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    width: '25ch',
    margin: '0 0 20px',
  },
}));
const Search = ({
  selected,
  initialArr,
  setInitialArr,
  setSearchedArr,
  searchedArr,
  searchedStr,
  setSearchedStr,
  service,
  serviceStr,
  refreshStay,
  setRefreshStay,
}) => {
  const token = parseCookie('sbi-token');
  const classes = useStyles();
  const getInitial = () => {
    service
      .all(token)
      .then((rs) => {
        console.log({ rs });
        const tempBoards = [...rs[serviceStr]]; //tuk da se oprawi
        console.log({ tempBoards });
        // tempBoards.map((el) => {
        //   console.log({ el });
        //   if (!el['partnersCode'][selected]) {
        //     el['partnersCode'][selected] = '';
        //   }
        // });
        setInitialArr(tempBoards);
        // setSearchedArr(tempBoards);
      })
      .catch(console.log);
  };
  useEffect(() => {
    setSearchedArr([]);
    getInitial();
    setRefreshStay(false);
    // eslint-disable-line react-hooks/exhaustive-deps
  }, [selected, refreshStay]);

  const searchHandler = (e) => {
    if (e?.preventDefault()) {
      e.preventDefault();
    }
    const searched = initialArr.filter((el) => (el.name + el.code)?.toLowerCase().includes(searchedStr.toLowerCase()));
    setSearchedArr(searched);
  };

  const searchHandlerHotel = (e) => {
    if (e?.preventDefault()) {
      e.preventDefault();
    }
    const searched = initialArr.filter((el, i) => {
      return (
        el.name?.toLowerCase().includes(searchedStr?.hotel?.toLowerCase()) &&
        el.resort?.toLowerCase().includes(searchedStr?.city?.toLowerCase())
      );
    });
    setSearchedArr(searched);
  };
  // const searchHandlerHotel = (e) => {
  //   if (e?.preventDefault()) {
  //     e.preventDefault();
  //   }
  //   const nulled = Promise.resolve(setSearchedArr([]));
  //   nulled
  //     .then((a) => {
  //       console.log('tuk', a, searchedArr);
  //       const searched = initialArr.filter((el, i) => {
  //         return (
  //           el.name?.toLowerCase().includes(searchedStr?.hotel?.toLowerCase()) &&
  //           el.resort?.toLowerCase().includes(searchedStr?.city?.toLowerCase())
  //         );
  //       });
  //       return searched;
  //     })
  //     .then((searched) => {
  //       setSearchedArr(searched);
  //     });
  // };
  useEffect(() => {
    if (initialArr && serviceStr !== 'hotels') {
      searchHandler();
    } else if (initialArr && serviceStr === 'hotels') {
      searchHandlerHotel();
    }
  }, [initialArr]);
  return (
    <React.Fragment>
      {serviceStr !== 'hotels' ? (
        <form onSubmit={searchHandler}>
          {/* <input type="text" value={searchedStr} onChange={(e) => setSearchedStr(e.target.value)} /> */}
          <TextField
            type="text"
            // id="standard-basic"
            label={serviceStr}
            variant="outlined"
            value={searchedStr}
            onChange={(e) => setSearchedStr(e.target.value)}
            className={classes.input}
          />
          {/* <button>Search</button> */}
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            endIcon={<Icon>search</Icon>}
            onClick={searchHandler}>
            Search
          </Button>
        </form>
      ) : (
        <form onSubmit={searchHandlerHotel}>
          {/* <label htmlFor="city">City </label> */}
          {/* <input
            id="city"
            type="text"
            value={searchedStr.city}
            onChange={(e) => setSearchedStr({ ...searchedStr, city: e.target.value })}
          />
          <label htmlFor="hotel-name">Hotel </label>
          <input
            id="hotel-name"
            type="text"
            value={searchedStr.hotel}
            onChange={(e) => setSearchedStr({ ...searchedStr, hotel: e.target.value })}
          /> */}
          <TextField
            type="text"
            id="city"
            label="city"
            variant="outlined"
            value={searchedStr.city}
            onChange={(e) => setSearchedStr({ ...searchedStr, city: e.target.value })}
            className={classes.input}
          />
          {`\t`}
          <TextField
            type="text"
            id="hotel-name"
            label="hotel"
            variant="outlined"
            value={searchedStr.hotel}
            onChange={(e) => setSearchedStr({ ...searchedStr, hotel: e.target.value })}
            className={classes.input}
          />
          {/* <button>Search</button> */}
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            endIcon={<Icon>send</Icon>}
            onClick={searchHandlerHotel}>
            Search
          </Button>
        </form>
      )}
      {/* {JSON.stringify(searchedArr)} */}
    </React.Fragment>
  );
};
export default Search;
