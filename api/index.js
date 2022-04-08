const dbConnect = require('./config/db');
const config = require('./config/config');
const app = require('express')();
const cron = require('./config/cron');
// const routes = require('./routes');
dbConnect()
  .then(() => {
    require('./config/express')(app);
    app.use(function (err, req, res, next) {
      //global error handling
      console.error(err);
    });
    app.listen(config.port, console.log(`Listening on port ${config.port}! Now its up to you...`));
    // cron;
  })
  .catch((err) => {
    console.log(err);
  });
