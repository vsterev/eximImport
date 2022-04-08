import React from 'react';
const Partner = React.createContext({
  partner: {
    _id: '',
    code: '',
    name: '',
    variablesName: {
      accommodation: '',
      action: '',
      checkIn: '',
      checkOut: '',
      flightIn: '',
      flightOut: '',
      hotel: '',
      pansion: '',
      roomType: '',
      tourists: '',
      transfer: '',
      name: '',
      familyName: '',
      gender: '',
      birthDate: '',
      email: '',
      phone: '',
      voucher: '',
    },
  },
  setPartner: () => {},
});
export default Partner;
