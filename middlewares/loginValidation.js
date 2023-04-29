// Middleware - ensures that the current user is authenticated before accessing /user/...
const loginValidator = (req, res, next) => {

    if (req.isAuthenticated()){
        return next()
    }

    // if not authenticated, send user to login page
    return res.redirect('/auth/login')
}

module.exports = loginValidator