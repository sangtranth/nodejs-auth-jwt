const router = require('express').Router();
const User = require('../model/User');
const { registerValidation, loginValidation } = require('../validation');
const bcryptjs = require('bcryptjs');
const { valid } = require('@hapi/joi');
const jwt = require('jsonwebtoken');

router.post('/register', async(req, res) => {
    

    //lets validate the data before we a user
    const {error} = await registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    

    //Checking if the user is already in the database
    const emailExists = await User.findOne({email: req.body.email});
    if(emailExists) return res.status(400).send('Email already exists');

    //Hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(req.body.password, salt);

    //Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password //hashPassword
    });
    
    try{
        const saveUser = await user.save();
        res.send(saveUser);
    }
    catch(err){
        res.sendStatus(400).send(err);
    }
    
});

//Login part
router.post('./login', async (req, res) => {
    //lets validate the data before we a user
    const {error} = loginValidation(res.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Checking the email and password
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email is not found');

    //Password is correct
    const validPass = await bcryptjs.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid password');

    //Create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECERT);
    res.header('auth-token', token).send(token);

    res.send('Logged in!');
});

module.exports = router;