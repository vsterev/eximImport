const rateLimit = require('express-rate-limit');

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

const limiter = (minutes, max) =>
  rateLimit({
    windowMs: minutes * 60 * 1000, // 15 minutes
    max: max,
    message: { err: 'Too many atempts, please try again later' },
  });
module.exports = limiter;
