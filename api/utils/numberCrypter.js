const shifer = { 0: '@', 1: 'x', 2: 'a', 3: '0', 4: 'j', 5: '1', 6: 'K', 7: 'i', 8: '2', 9: '5' };
// const num = '890744';
const crypter = (n) => {
  let txt = '';
  n.toString()
    .split('')
    .map((v) => (txt += shifer[v]));
  //   console.log(txt);
  return txt;
};

const decrypter = (n) => {
  let txt = '';
  n.split('').map((v) =>
    Object.entries(shifer).filter((k) => {
      if (k[1] === v) {
        txt += k[0];
      }
    })
  );
  return txt;
};
// console.log(crypter(num));
// console.log(decrypter(crypter(num)));
module.exports = { crypter, decrypter };
