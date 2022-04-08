import React, { useState } from 'react';
import PartnerContext from './partnerContext';
const GlobalValues = (props) => {
  // const [partner, setPartner] = useState({ partner: { _id: '', code: '', name: '' } });
  const [partner, setPartner] = useState('');
  return <PartnerContext.Provider value={{ partner, setPartner }}>{props.children}</PartnerContext.Provider>;
};
export default GlobalValues;
