const db = require('../models/database.js');
const bcrypt = require('bcrypt');

const accountController = {
    
    Register: {
        GetRegisterForm: (req, res) => {
            if(req.session.username)
            {
                console.log(req.session.username)
                console.log(req.session.role)
                if(req.session.role == "Owner")
                {
                    res.render('register', {title: "Register"});
                }
                else
                {
                    res.redirect('404');
                }
            }
            else
            {
                res.redirect('/');
            }
        },

        CheckEmail: async (req, res) => {
            await db.Account.findOne({Email: req.query.email})
                .then((result) => {
                    res.send(result);
                })
        },

        CheckUsername: async (req, res) => {
            await db.Account.findOne({Username: req.query.username})
                .then((result) => {
                    res.send(result);
                })
        },

        SignUp: (req, res) => {
            var temp = req.body.AccountInfo;

            bcrypt.hash(temp.Password, 10, function(err, hash)
            {
                const user = new db.Account({ 
                    FirstName: temp.FirstName,
                    LastName: temp.LastName,
                    Username: temp.Username,
                    Email: temp.Email,
                    Role: temp.Role,
                    Password: hash
                })
                // save the details to the database
                user.save()
                console.log("User added to account database:\n" + user);
                res.status(200).send();
            });
            
        }
    },

    Login: {

        GetLoginForm: (req, res) => {
            if(req.session.username)
            {
                res.redirect('dashboard');
            }
            else
            {
                res.render('login', {title: "Login"});
            }
        },

        CheckInformation: async (req, res) => {
            var temp = req.query.LoginInfo;

            await db.Account.findOne({Username: temp.Username})
                .then((User) => {

                    if(User)
                    {
                        bcrypt.compare(temp.Password, User.Password, function(err, result) {
                            if(result) {
                                req.session.username = temp.Username;
                                req.session.role = User.Role;
                                console.log('Successfully logged in');
                                res.send("success");
                            }
                            else {
                                res.send("invalidpassword");
                            }
                        })
                    }
                    else
                    {
                        res.send("invalidusername");
                    }

                })
            
        }
    }
    
}

module.exports = accountController;