// const crypto = require('crypto');
// const secret = 'vaskoepi4';
// const hash = crypto.createHmac('sha512', secret).update('I love cupcakes').digest('hex');
// console.log(hash);

const crypto = require('crypto');
const api_secret = '$2y$10$9ruO/hrtIxJb.804MRWhGePCMFn0V7PVUPqi1hd5HFiTCbR7mq9pC';
let data = [
  {
    msisdn: '359883460639',
    sc: '1909',
    text: 'hello world',
    service_id: 495,
  },
  {
    msisdn: '359883460639',
    sc: '1909',
    text: 'hello world',
    service_id: 495,
  },
  {
    msisdn: '359883460632',
    sc: '1909',
    text: 'hello world',
    service_id: 495,
  },
  {
    msisdn: '359883460633',
    sc: '1909',
    text: 'hello world',
    service_id: 495,
  },
  {
    msisdn: '359883460639',
    sc: '1909',
    text: 'hello world',
    service_id: 495,
  },
];
data = JSON.stringify(data);
console.log(data);
function getHash(d) {
  const hmac = crypto.createHmac('sha512', api_secret);
  hmac.update(d);
  return hmac.digest('hex');
}
console.log(getHash(data));
