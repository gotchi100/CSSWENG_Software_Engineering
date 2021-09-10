const db = require('../models/database.js');

const accountController = {
    
    Register: {
        GetRegisterForm: (req, res) => {
            res.render('register', {title: "Register"});
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

        SignUp: async (req, res) => {

            var temp = req.body.AccountInfo;
            const user = new db.Account({ 
                FirstName: temp.FirstName,
                LastName: temp.LastName,
                Username: temp.Username,
                Email: temp.Email,
                Role: temp.Role,
                Password: temp.Password
            })
    
            // save the details to the database
            user.save()
            console.log("User added to account database:\n" + user);
            res.status(200).send();
        }
    }

}

module.exports = accountController;