// brought in 'express'
const express = require('express')
// brought in 'body-parser'
const bodyParser = require('body-parser')
// 
const dbConfig = require('./config/db.config')

const app = express()
//------------COPIED FROM AUTH.ROUTES.JS--------------------//
const { verifySignUp } = require('./middlewares/')
const controller = require('./controllers/auth.controller')
//------------COPIED FROM AUTH.ROUTES.JS--------------------//

// Make sure the App is using 'Body-Parser
// parse requests of content-type - application/json
app.use(bodyParser.json())

// parse requests of content-type = application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))

// Setup Mongoose
const db = require('./models/index')
const Role = db.role

db.mongoose
    .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then (() => {
        console.log("Successfully connect to the Mongo DB!")
        // the line below will call the initial function that was created below.
        initial()
    })
    .catch(err => {
        console.error("Connection Error", err)
        // If there is an error the line below will stop the process from continuing 
        // because the system caught the error. 
        process.exit()
    })

// simple route, do I work?
app.get('/', (req, res) => {
    res.json({message: "Welcome to the Home Page"})
})

// Here I am going to import the routes I wrote.
// (app) this is passing it into the routes. 
//require("./routes/auth.routes")
//require("./routes/user.routes")

//------------COPIED FROM AUTH.ROUTES.JS--------------------//
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
//------------COPIED FROM AUTH.ROUTES.JS--------------------//


// set the port, listen for the message.
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`)
})

// this function will create all the possible roles at the beginning of the app. 
// It will go through the roles database.
function initial(){
    Role.estimatedDocumentCount((err, count) => {
        // if no roles are present, create our new roles (admin and user)
        if(!err && count === 0){
            new Role({
                name: 'user'
            }).save(err => {
                if(err) {
                    console.log("error", err)
                }
                console.log("added users to roles collection")
            })
        
            new Role({
                name: 'admin'
            }).save(err => {
                if(err) {
                    console.log("error", err)
                }
                console.log("added users to roles collection")
            })            
        }
    })

}