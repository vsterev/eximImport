import React, { useEffect, useState, useContext } from 'react';
import partnerService from '../../../services/partner';
import parseCookie from '../../../utils/parseCookie';
import PartnerContext from '../../../utils/partnerContext';
import { makeStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
const useStyles = makeStyles((theme) => ({
  select: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const PartnersSelect = () => {
  const classes = useStyles();
  const [getPartners, setGetPartners] = useState([]);
  const { partner, setPartner } = useContext(PartnerContext);
  useEffect(() => {
    const token = parseCookie('sbi-token');
    partnerService
      .all(token)
      .then((prt) => {
        setGetPartners(prt.partners);
      })
      .catch(console.log);
  }, []);
  const changeHandler = (e) => {
    const el = [...getPartners].find((rw) => rw.partner === e.target.value);
    // const el = [...getPartners][e.target.value];
    // setSelectedPartners({ _id: el._id, code: el.partner, name: el.name });
    console.log(el);
    if (el) {
      setPartner({ _id: el._id, code: el.partner, name: el.name, variablesName: el.variablesName });
    } else {
      setPartner({ _id: undefined, code: undefined, name: undefined });
    }
  };
  return (
    // <form>
    //   <label>
    //     Select a Partner NEW:
    //     <select id="partnerSelect" onChange={changeHandler} value={partner.code}>
    //       {!partner.code && <option value="">please select</option>}
    //       {getPartners.map((prt, i) => {
    //         return (
    //           <option key={prt._id} value={prt.partner}>
    //             {prt.name}
    //           </option>
    //         );
    //       })}
    //     </select>
    //     {/* {JSON.stringify(partner)} */}
    //   </label>
    // </form>
    // <FormControl className={classes.formControl}>
    <FormControl className={classes.select}>
      <NativeSelect
        // className={classes.selectEmpty}
        value={partner.code}
        name="age"
        onChange={changeHandler}
        inputProps={{ 'aria-label': 'age' }}>
        {!partner.code && <option value="">please select</option>}
        {getPartners.map((prt, i) => {
          return (
            <option key={prt._id} value={prt.partner}>
              {prt.name}
            </option>
          );
        })}
      </NativeSelect>
      <FormHelperText>select a partner</FormHelperText>
    </FormControl>
  );
};
export default PartnersSelect;
