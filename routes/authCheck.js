// const authCheck = (req, res, next) => {
//     //    if not yet login
//     if (!req.user) {
//         // res.redirect("/auth/login");
//         res.redirect("/api");
//     } else {
//         next();
//     }
// };

require('dotenv').config();
const jwt = require('jsonwebtoken');

const authCheck = (req, res, next) => {
    const token = req.signedCookies['mytoken'];
    if (token) {
        jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if (err) {
                //token is wrong
                console.log(err);
                res.redirect("/api");
            } else {
                // OK, decoding is done
                req.decoded = decoded;
                next();
            }
        });
    }
    else {
        //no token, return to homepage
        res.redirect("/api");
    }
}

module.exports = authCheck;