import config from './config';
const Boards = {
  all: (str) => {
    return fetch(`${config.backEndUrl}/${str}/all`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json' },
    })
      .then((res) => res.json())
      .catch((e) => console.error(e));
  },
  updateMany: (str, data) => {
    return fetch(`${config.backEndUrl}/${str}/update-all`, {
      body: JSON.stringify(data),
      method: 'PATCH',
      headers: { 'Content-type': 'application/json' },
    })
      .then((res) => res.json())
      .catch((e) => console.error(e));
  },
};
export default Boards;
