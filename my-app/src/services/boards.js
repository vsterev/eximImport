import config from './config';
const Boards = {
  all: (token) => {
    return fetch(`${config.backEndUrl}/boards/all`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: token },
    })
      .then((res) => res.json())
      .catch((e) => console.error(e));
  },
  sync: () => {
    return fetch(`${config.backEndUrl}/boards/sync`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json' },
    })
      .then((res) => res.json())
      .catch((e) => console.error(e));
  },
  updateMany: (data, token) => {
    return fetch(`${config.backEndUrl}/boards/update-all`, {
      body: JSON.stringify(data),
      method: 'PATCH',
      headers: { 'Content-type': 'application/json', Authorization: token },
    })
      .then((res) => res.json())
      .catch((e) => console.error(e));
  },
};
export default Boards;
