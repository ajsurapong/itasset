require('dotenv').config();

const config = {
    host    : process.env.DB_HOST,
    user    : process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB
  };
   
module.exports = config;
