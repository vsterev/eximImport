import config from './config';
const userServices = {
  login: (data) => {
    return fetch(`${config.backEndUrl}/user/login`, {
      body: JSON.stringify(data),
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
    })
      .then((res) => {
        if (res.status !== 200) {
          throw Error(`Incorrect user or password, please try again`);
        }
        return res.json();
      })
      .catch((e) => {
        throw e;
      });
  },
  register: (data) => {
    console.log('v register syyyyyyyyyyyym');
    return fetch(`${config.backEndUrl}/user/register`, {
      body: JSON.stringify(data),
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
    })
      .then((res) => res.json())
      .catch((e) => console.error(e));
  },
  verify: (token) => {
    return fetch(`${config.backEndUrl}/user/verify`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: token },
    })
      .then((res) => res.json())
      .catch((e) => console.error(e));
  },
  nameChange: (token, data) => {
    return fetch(`${config.backEndUrl}/user/namechange`, {
      body: JSON.stringify(data),
      method: 'PUT',
      headers: { 'Content-type': 'application/json', Authorization: token },
    })
      .then((res) => res.json())
      .catch((e) => console.error(e));
  },
  passChange: (token, data) => {
    return fetch(`${config.backEndUrl}/user/passchange`, {
      body: JSON.stringify(data),
      method: 'PUT',
      headers: { 'Content-type': 'application/json', Authorization: token },
    })
      .then((res) => res.json())
      .catch((e) => console.error(e));
  },
  adminChange: (token, data) => {
    return fetch(`${config.backEndUrl}/user/admin-change`, {
      body: JSON.stringify(data),
      method: 'PUT',
      headers: { 'Content-type': 'application/json', Authorization: token },
    })
      .then((res) => res.json())
      .catch((e) => console.error(e));
  },
  getAll: (token) => {
    return fetch(`${config.backEndUrl}/user/all-users`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: token },
    })
      .then((res) => res.json())
      .catch((e) => console.error(e));
  },
  delete: (token, data) => {
    return fetch(`${config.backEndUrl}/user/delete`, {
      body: JSON.stringify(data),
      method: 'DELETE',
      headers: { 'Content-type': 'application/json', Authorization: token },
    })
      .then((res) => res.json())
      .catch((e) => console.error(e));
  },
};
export default userServices;
