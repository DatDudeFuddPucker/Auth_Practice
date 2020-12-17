// This is used to authorize out token
const jwt = require ('jsonwebtoken')
// This brings in our secret password
const config = require("../config/auth.config")
const db = require('../models/index')
const User = db.user
const Role = db.role

// Verify Web Token functon
// It takes request, response, and next.
// This function will verify our Web Token
verifyWebToken = (req, res, next) => {
    // Here we first declare our Tokem
    // This Token is passed in our headers.
    let token = req.headers['x-access-token']

    // If there is no Token given we respond with the below error.
    // Error: 403 Status
    if(!token) {
        return res.status(403).send({message: "No Token provided"})
    }

    // Here we try to verify the token.
    // Here it will respond with and 'error' or it will be decoded.
    // If there is an error we respond with the below error.
    // Error: 401 Status
    // The decoding will decode the secret in the 'auth.config.js' file.
    jwt.verify(token, config.secret, (err, decoded) => {
        if(err) {
            return res.status(401).send({message: "UnAuthorized"})
        }

        // This will set the 'userId' to the decode Id.
        req.userId = decoded.id
        // 'next' tells the code to continue to the next process in the code.
        // It is an express function explicitly.
        // In unit 2 there was an entry point file that would have all the functions run automatically. 
        // 'next' essentially simulates this, but forcing the program to continue to the next step 
        // in the code. 
        // Without the next in the code, the process will stop. 
        // Example of next process -
        // After verifying the JWT
        // next process would be something like go to the next part of the code and continue on. 
        next()
    })
}

// Another function that will verify id admin or not
isAdmin = (req, res, next) => {
    // '.exec' will return the user we want to have access too
    // If the instrutor is not mistake, '.then' will not
    User.find(req.user.id).exec((err, user) => {
        // Here an error will be thrown because the user does not exist. 
        if (err) {
            return res.status(500).send({message: err})
        }

        Role.find({
            _id: { $in: user.roles}
        }, (err, roles) => {
            if (err) {
                return res.status(500).send({message: err})
            }
            
            // Here we will loop through roles and check if there is an admin role.
            for (let i = 0; i < roles.length; i++) {
                if(roles[i].name === 'admin') {
                    next()
                    return
                }
            }

            // If there is no admin role found then this error status will be thrown
            // Error: 403 status
            res.status(403).send({message: "Requires Admin Role"})
        })
    })
}

// here is an object called 'authJwt'
// in this object we have the two functions we created in this file. 
// here the two functions we created are
// function = 'verifyWebToken'
// function = 'idAdmin'

const authJwt = {
    verifyWebToken, // adding the '()' onto the end here will automatically run the function. 
    isAdmin
}

// This line exports the object that we have declared right above this line. 
module.exports.authJwt