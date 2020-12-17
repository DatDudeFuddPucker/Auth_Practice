const { verifySignUp } = require('../middlewares/')
const controller = require('../controllers/auth.controller')

module.exports = function(app) {
    app.use((req, res, next) => {
        // This will set the header and allow use of x access token
        // ( we will use this to pass our token. )
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, COntent-type, Accept"
        )
        next()
    })

    // This sets up the sign-up route and passes iddlewares to check 
    // username, email, and roles.
    app.post("/api/auth/signup", 
    [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted], 
    controller.signup
    )

    // This will handle the sign-in
    app.post("/api/auth/signin", controller.signin)
}