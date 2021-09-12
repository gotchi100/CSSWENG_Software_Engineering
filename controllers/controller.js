const db = require('../models/database.js');


const Controller = {

    GetIndex: (req, res) => {

        if(req.session.username)
        {
            res.redirect('dashboard');
        }
        else
        {
            res.redirect('login');
        }
    },
    
    GetDashboard: (req, res) => {

        if(req.session.username)
        {
            res.render('dashboard', {title: "Dashboard"});
        }
        else
        {
            res.redirect('login');
        }
    },

    GetProfile: (req, res) => {
        if(req.session.username)
        {
            db.Account.findOne({Username: req.session.username})
                .then((User) => {
                    res.render('profile', {User, title: "Profile"});
                });
        }
        else
        {
            res.redirect('login');
        }
    },

    CheckRole: (req, res) => {
        res.send(req.session.role);
    },

    Logout: async (req, res) => {
        await req.session.destroy(); // Deletes the session in the database.
		req.session = null // Deletes the cookie.
        console.log('Successfully logged out');
		res.redirect('/');
    }
    
}

module.exports = Controller;