import config from './config';
const TransferTypes = {
  all: (token) => {
    return fetch(`${config.backEndUrl}/transfer-types/all`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: token },
    })
      .then((res) => res.json())
      .catch((e) => console.error(e));
  },
  updateMany: (data, token) => {
    return fetch(`${config.backEndUrl}/transfer-types/update-all`, {
      body: JSON.stringify(data),
      method: 'PATCH',
      headers: { 'Content-type': 'application/json', Authorization: token },
    })
      .then((res) => res.json())
      .catch((e) => console.error(e));
  },
  sync: () => {
    return fetch(`${config.backEndUrl}/transfer-types/sync`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json' },
    })
      .then((res) => res.json())
      .catch((e) => console.error(e));
  },
};
export default TransferTypes;
