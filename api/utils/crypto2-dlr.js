const crypto = require('crypto');
const request = require('request');
const fetch = require('node-fetch');
const api_secret = '$2y$10$9ruO/hrtIxJb.804MRWhGePCMFn0V7PVUPqi1hd5HFiTCbR7mq9pC';
const api_key = '$2y$10$MWBcBQsMY1fDh2Gjp3tNyOmEj8JqQpXK2YwirwTqHCwhIhF0HoKpi';

function getHash(data) {
  const hmac = crypto.createHmac('sha512', api_secret);
  hmac.update(data);
  return hmac.digest('hex');
}

let data = JSON.stringify({
  sms_id: 'test1-606e92abd3e9e0.80433484',
  service_id: 495,
});
console.log(data);
console.log(getHash(data));

const linkMobility = function (data) {
  fetch('https://api-test.msghub.cloud/dlr', {
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
