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

    Logout: async (req, res) => {
        await req.session.destroy(); // Deletes the session in the database.
		req.session = null // Deletes the cookie.
        console.log('Successfully logged out');
		res.redirect('/');
    }
    
}

module.exports = Controller;