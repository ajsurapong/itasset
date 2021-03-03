const authCheck = (req, res, next) => {
    //    if not yet login
    if (!req.user) {
        // res.redirect("/auth/login");
        res.redirect("/api");
    } else {
        next();
    }
};

module.exports = authCheck;