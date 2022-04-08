const crypto = require('crypto');
const request = require('request');
const fetch = require('node-fetch');

const api_secret = '$2y$10$9ruO/hrtIxJb.804MRWhGePCMFn0V7PVUPqi1hd5HFiTCbR7mq9pC';
const api_key = '$2y$10$MWBcBQsMY1fDh2Gjp3tNyOmEj8JqQpXK2YwirwTqHCwhIhF0HoKpi';

function getHash(d) {
  const hmac = crypto.createHmac('sha512', api_secret);
  hmac.update(d);
  return hmac.digest('hex');
}

let data = JSON.stringify([
  {
    msisdn: '359883460639',
    // sc: '1909',
    sc: 'ViberTest',
    text: 'hello world',
    service_id: 495,
    fallback: [{ sms: 'hello' }],
  },
  {
    msisdn: '359885999189',
    // sc: '1909',
    sc: 'ViberTest',
    text: 'hello world2',
    service_id: 495,
    fallback: [{ sms: 'hello' }],
  },
]);

const linkMobility = function (data) {
  fetch('https://api-test.msghub.cloud/send', {
    method: 'post',
    body: data,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': api_key,
      'x-api-sign': getHash(data),
      Expect: '',
    },
  })
    .then((rs) => rs.json())
    .then(console.log)
    .catch(() => rs.json());
};
linkMobility(data);
