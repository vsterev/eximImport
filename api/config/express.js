const express = require('express');
const cors = require('cors');
const routes = require('../routes');
const rateLimit = require('express-rate-limit');

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,
  message: 'Too many accounts created from this IP, please try again after an hour',
});

// only apply to requests that begin with /api/

module.exports = (app) => {
  app.use(
    cors({
      exposedHeaders: 'Authorization',
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true })); //to recognize req.body in post request
  app.use('/static', express.static('static'));
  app.use('/', routes.contacts);
  app.use('/user', routes.user);
  app.use('/hotels', routes.hotel);
  app.use('/resorts', routes.resort);
  app.use('/boards', routes.boards);
  app.use('/transfer-types', routes.transferTypes);
  app.use('/partners', routes.partners);
  app.use('/il', routes.inlooks);
};
