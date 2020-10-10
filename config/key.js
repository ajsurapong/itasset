require('dotenv').config();

module.exports = {
    google:{
        client: process.env.GOOGLE_CLIENT,
        secret: process.env.GOOGLE_SECRET
    },
    cookie: {
        secret: process.env.COOKIE_SECRET
    }
};