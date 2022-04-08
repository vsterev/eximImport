import config from './config';
const Partners = {
  all: (token) => {
    return fetch(`${config.backEndUrl}/partners/all`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: token },
    })
      .then((res) => res.json())
      .catch((e) => console.error(e));
  },
  update: (data, token) => {
    return fetch(`${config.backEndUrl}/partners/update`, {
      body: JSON.stringify(data),
      method: 'POST',
      headers: { 'Content-type': 'application/json', Authorization: token },
    })
      .then((res) => res.json())
      .catch((e) => console.error(e));
  },
  delete: (data, token) => {
    return fetch(`${config.backEndUrl}/partners/delete`, {
      body: JSON.stringify(data),
      method: 'POST',
      headers: { 'Content-type': 'application/json', Authorization: token },
    })
      .then((res) => res.json())
      .catch((e) => console.error(e));
  },
  delete2: (data, token) => {
    return fetch(`${config.backEndUrl}/partners/delete2`, {
      body: JSON.stringify(data),
      method: 'DELETE',
      headers: { 'Content-type': 'application/json', Authorization: token },
    })
      .then((res) => res.json())
      .catch((e) => console.error(e));
  },
  create: (data, token) => {
    return fetch(`${config.backEndUrl}/partners/create`, {
      body: JSON.stringify(data),
      method: 'POST',
      headers: { 'Content-type': 'application/json', Authorization: token },
    })
      .then((res) => res.json())
      .catch((e) => console.error(e));
  },
};
export default Partners;
