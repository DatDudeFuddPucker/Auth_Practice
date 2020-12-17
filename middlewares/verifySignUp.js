const db = require('../models/index')
const Role = db.role
const User = db.user
checkDuplicateUsernameOrEmail = (req, res, next) => {
    // Username
    User.findOne({
      username: req.body.username
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (user) {
        res.status(400).send({ message: "Failed! Username is already in use!" });
        return;
      }
      // Email
      User.findOne({
        email: req.body.email
      }).exec((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if (user) {
          res.status(400).send({ message: "Failed! Email is already in use!" });
          return;
        }
        next();
      });
    });
  };

// checkDuplicateUsernameOrEmail = (req, res, next) => {
//     // This will look into our user Database and see if the user exists already
//     // this will check for an existing username
//     // 
//     User.findOne({
//         username: req.body.username
//     }).exec ((err, user) => {
//         if(err) {
//             res.status(500).send({message: err})
//             return // <-----this will stop the entire process if an error is encoutered. 
//         }
//         if (user) {
//             res.status(400).send({message: "failed, this user already exists!"})
//         }
//     // check for existing email address
//     User.findOne({
//         email: req.body.email
//     }).exec ((err, user) => {
//         if(err) {
//             res.status(500).send({message: err})
//             return // <-----this will stop the entire process if an error is encoutered. 
//         }
//         if (user) {
//             res.status(400).send({message: "Failed!, Email is already in use!"})
//             return;
//         }
//             next();
//     })
//     })
// }
//     // Check if the Roles already existed
    checkRolesExisted = (req, res, next) => {
        // this line is checking what is going on in the postman app
        if(req.body.roles) {
            for (let i = 0; i < req.body.roles.length; i++) {
                if(!ROLES.includes(req.body.roles[i])) {
                    res.status(400).send ({
                        message: `Failed! Role ${req.body.roles[i]} does not exist!`
                    })
                    return
                }
            }
        }
        next()
    }

    const verifySignUp = {
        checkDuplicateUsernameOrEmail,
        checkRolesExisted
    }

    module.exports = verifySignUp

//---------