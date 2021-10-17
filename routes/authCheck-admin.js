const authCheckAdmin = (req, res, next) => {
    if (req.decoded.role == 1 || req.decoded.role == 3) {
        next();
    }
    else {
        //notadmin
        res.redirect("/api");
    }
}

module.exports = authCheckAdmin;