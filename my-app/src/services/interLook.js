import config from './config';
const InterLookService = {
  syncHotels: (token) => {
    return fetch(`${config.backEndUrl}/il/get-hotels`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: token },
    })
      .then((res) => res.json())
      .catch((e) => console.error(e));
  },
  syncCities: (token) => {
    return fetch(`${config.backEndUrl}/il/get-cities`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: token },
    })
      .then((res) => res.json())
      .catch((e) => console.error(e));
  },
  searchHotel: (data) => {
    return fetch(`${config.backEndUrl}/il/hotelservices`, {
      body: JSON.stringify(data),
      method: 'POST',
      //   headers: { 'Content-type': 'application/json', Authorization: token },
      headers: { 'Content-type': 'application/json' },
    })
      .then((res) => res.json())
      .catch((e) => console.error(e));
  },
  createReserv: (data) => {
    return fetch(`${config.backEndUrl}/il/create-reservation`, {
      body: JSON.stringify(data),
      method: 'POST',
      //   headers: { 'Content-type': 'application/json', Authorization: token },
      headers: { 'Content-type': 'application/json' },
    })
      .then((res) => res.json())
      .catch((e) => console.error(e));
  },
  cancelReserv: (data) => {
    return fetch(`${config.backEndUrl}/il/cancel-reservation`, {
      body: JSON.stringify(data),
      method: 'POST',
      //   headers: { 'Content-type': 'application/json', Authorization: token },
      headers: { 'Content-type': 'application/json' },
    })
      .then((res) => res.json())
      .catch((e) => console.error(e));
  },
};
export default InterLookService;
