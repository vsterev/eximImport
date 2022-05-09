const env = process.env.NODE_ENV || 'production';
// const env = process.env.NODE_ENV || 'development';
const DB_PASS = process.env.DB_PASS;
const DB_USER = process.env.DB_USER;
const config = {
  development: {
    port: 4000,
    // port: process.env.PORT || 3000,
    // dataBaseUrl: `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0-azuwr.mongodb.net/messageAPI`,
    dataBaseUrl: 'mongodb://127.0.0.1:27017/hotels-api',
    // ilUrl: 'https://iservice.solvex.bg/IntegrationService.asmx',
    ilUrl: 'https://evaluation.solvex.bg/iservice/integrationservice.asmx',
  },
  production: {
    port: 4000,
    dataBaseUrl: 'mongodb://192.168.10.10:27017/hotels-api',
    ilUrl: 'https://iservice.solvex.bg/IntegrationService.asmx',
  },
};
module.exports = config[env];
