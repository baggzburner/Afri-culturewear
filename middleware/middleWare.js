function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
        // Set headers to prevent caching
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
        return next();
    } else {
        res.redirect("/login");
    }
}

module.exports = ensureAuthenticated;
