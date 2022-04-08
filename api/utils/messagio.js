const md5 = require('md5');
const sending_method = 'sms';
const from = 'tgs';
const user = 'bvkpk5a0q9jg6oc18g60';
const txt = 'test';
const phone = '359888340639';
const secret_key = 'bvktuunb7rja09h1b5ug';
const sign = md5(user + from + phone + txt + secret_key);
console.log(sign);
