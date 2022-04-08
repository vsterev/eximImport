const fetch = require('node-fetch');
const domain = 'link.na-more.bg';
let requestHeaders = {
  'Content-Type': 'application/json',
  apikey: 'f545a44730f04637a7f4a768facf6d0b',
  //   workspace: 'YOUR_WORKSPACE_ID',
};
const shortenUrl = (resortId, checkIn, checkOut) => {
  let linkRequest = {
    destination: `https://b2b.solvex.bg/en/excursions?city_id=${resortId}&start_date=${checkIn}&end_date=${checkOut}`,
    domain: { fullName: 'link.na-more.bg' },
    // slashtag: 'excursion',
    // title: 'Excursion info Solvex',
  };
  return (
    fetch(`https://api.rebrandly.com/v1/links`, {
      method: 'POST',
      body: JSON.stringify(linkRequest),
      headers: requestHeaders,
    })
      .then((res) => res.json())
      .then((sh) => sh.shortUrl)
      // .then((ur) => console.log(ur))
      .catch(console.log)
  );
};
module.exports = shortenUrl;
