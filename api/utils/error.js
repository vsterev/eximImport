module.exports = class MissingIdError extends Error {
  constructor(...params) {
    super(...params); // (1)
    this.name = 'MissingIdError'; // (2)
    this.date = new Date();
    this.code = 2014;
  }
};
