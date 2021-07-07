const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('../users/users-model');

//register new user api/auth/register
router.post('/register', (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 14);

    user.password = hash;

    Users.add(user)
        .then(saved => {
            res.status(201).json(saved);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

//registered user login api/auth/login
router.post('/login', (req, res) => {
    let {username, password} = req.body;

    Users.findBy({username})
    .first()
    .then(user => {
        if(user && bcrypt.compareSync(password, user.password)){
            req.session.user = user;

            res.status(200).json({message: `Welcome ${user.username}!`});
        }else {
            res.status(401).json({message: "Invalid username and password"});
        }
    })
    .catch(err => {
        res.status(500).json(err)
    });
});

// logout api/auth/loggot
router.get('/logout', (req, res) => {
    if(req.session){
        req.session.destroy(err => {
            if(err){
                res.status(500).json({message: "There was a problem deleting session"})
            }else {
                res.status(200).json({message: " Logged out"})
            }
        });
    }
});


module.exports = router;