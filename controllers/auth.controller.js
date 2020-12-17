const config = require('../config/auth.config')
const db = require('../models/index')

// These lines below give us access to our db through 'User' and 'Role' variable.
const User = db.user
const Role = db.role


// This line below will give us access to encode and decode the 'jwt' itself. 
// It allows us to work with 'jwt'
const jwt = require('jsonwebtoken')
// This line is for hashing/encrypting out passwords
const bcrypt = require('bcryptjs')
const { Roles } = require('../models/index')

// This first function will handle our sign-up for us.
exports.signup = (req, res) => {
    // We are going to create our user object.
    // We are going to do this using the 'params' returned from 'req'.
    // ----> In this case the values from ('req.body.username', 'req.body.email', req.body.password')

    console.log(req.body)
    const user = new User ({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    }) 

    // Here we save that user.
    // If there is an error than the error status will be thrown
    user.save((err, user) => {
        if (err) {
            res.status(500).send({message: err})
            return
        }

        // Here we are going to query Roles
        // We are looking to see if the values match.
        // If there is no error, we check if roles was passed on req.params
        if(req.body.roles) {
            Role.find({
                name: {$in: req.body.roles}
            }, (err, roles) => {

                //
                if (err) {
                    res.status(500).send({message: err})
                    return
                }

                // Here we want to save this Role as an ID. 
                // Pass roles id from query above to user.roles
                user.roles = roles.map(role => role._id)
                // Save our Updates Users
                user.save(err => {
                    if (err) {
                        res.status(500).send({message: err})
                        return
                    }

                    // 
                    res.send({message: "User Created Successfully"})
                })

            })
        } else {
            Role.findOne({name: "user"}, (err, roles) => {
                if (err) {
                    res.status(500).send({message: err})
                    return
                }

                user.roles = [roles._id]

                user.save(err => {
                    if (err) {
                        res.status(500).send({message: err})
                        return
                    }

                    // 
                    res.send({message: "User was Registered SUccessfully"})
                })
            })
        }
    })
}

exports.signin = (req, res) => {
    User.findOne({
        username: req.body.username
    })

    // the '.populate' is saying "if you have roles on here, I want you to populate the data".
    // populates values from the roles id we stred in the document.
    // "-__v" = 
    .populate("roles", "-__v")
    .exec((err, user) => {
        if (err) {
            res.status(500).send({message: err})
            return
        }

        // If the user does not exist, then the following error status gets thrown
        // Error: 404 status
        if(!user) {
            return res.status(404).send({message: "User not Found"})
        }

        // This will validate the password by passing req.body password and the password
        // returned from the DB over to bcrypt to unhash and compare.
        const passwordIsValid = bcrypt.compareSync(
            req.body.password, // un-encrypted password from req.body
            user.password // encrypted password saved in the db
        )

        // Password is NOT valid - We are returning the following error status
        // This will return a boolean
        // Error: 401 status
        if(!passwordIsValid) {
            return res.status(401).send({acessToken: null, message: "Invalid Password"})
        }

        console.log(passwordIsValid) // atempting to see what it returns as. 

        // Password IS Valid - We will generate a new token.
        const token = jwt.sign({id: user.id}, config.secret, {
            expiresIn: 86400 // A 24 hour times in which this token will be valid. After this 24 hour period, the token validity is lost.
        })

        // This is setting roles to pass back in our response.
        let authorities =[]
        // 
        for (let i = 0; i < user.roles.length; i++) {
            authorities.push("ROLE_" + user.roles[i].name.toUpperCase())
        }

        // seeding that response back.
        res.status(200).send({
            id: user._id,
            username: user.username,
            email: user.email,
            roles: authorities,
            accessToken: token
        })
    })
}