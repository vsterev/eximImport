const crypto = require('crypto');
const request = require('request');

const api_secret = '$2y$10$9ruO/hrtIxJb.804MRWhGePCMFn0V7PVUPqi1hd5HFiTCbR7mq9pC';
const api_key = '$2y$10$MWBcBQsMY1fDh2Gjp3tNyOmEj8JqQpXK2YwirwTqHCwhIhF0HoKpi';

function getHash(data) {
  const hmac = crypto.createHmac('sha512', api_secret);
  hmac.update(data);
  return hmac.digest('hex');
}

let data = JSON.stringify([
  {
    msisdn: '359883460639',
    sc: '1909',
    text: 'hello world',
    service_id: 495,
  },
  {
    msisdn: '359885999189',
    sc: '1909',
    text: 'hello world1',
    service_id: 495,
  },
]);

request(
  {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': api_key,
      'x-api-sign': getHash(data),
      Expect: '',
    },
    url: 'https://api-test.msghub.cloud/bulknew',
    body: data,
    method: 'POST',
  },
  function (err, res, body) {
    console.log(body);
  }
);
