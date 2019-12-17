const bcrypt = require('bcryptjs');

const router = require('express').Router();

const Users = require('../users/users-model');

//register new user
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

router.post('/login', (req, res) => {
    let {username, password} = req.body;

    Users.findBy({username})
    .first()
    .then(user => {
        if(user && bcrypt.compareSync(password, user.password)){
            res.status(200).json({message: `Welcome ${user.username}!`});
        }else {
            res.status(401).json({message: "Invalid username and password"});
        }
    })
    .catch(err => {
        res.status(500).json(err)
    });
});



module.exports = router;