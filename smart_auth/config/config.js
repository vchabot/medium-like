const getenv = require('getenv');

module.exports = {
    DB_HOST: getenv("DB_HOST"),
    DB_USER: getenv("DB_USER"),
    DB_PASSWORD: getenv("DB_PASSWORD"),
    DB_NAME: getenv("DB_NAME"),
    TOKEN_SECRET: getenv("TOKEN_SECRET"),
    SMART_DOCTRINA_URL: getenv("SMART_DOCTRINA_URL"),
};
