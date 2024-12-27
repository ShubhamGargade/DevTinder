const express = require('express');
const authRouter = express.Router();
const User = require('../model/user.js');
const bcrypt = require('bcrypt');

authRouter.post('/signin', async (req, res, next) => {
    try {
        const {firstName, lastName, emailId, password, gender, age, about, skills} = req.body;
        const encryptedPassword = await bcrypt.hash(password, 10);
        const user = new User({firstName, lastName, emailId, password: encryptedPassword, gender, age, about, skills});
        await user.save();
        res.send('User created successfully');
    } catch (error) {
        res.status(400).send("Error creating a user: " + error.message);
    }
});

authRouter.post('/login', async(req, res) => {
    try {
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error('Invalid Credentails');
        }
        // const isPasswordValid = await bcrypt.compare(password, user.password);
        const isPasswordValid = await user.validatePassword(password);
        if(!isPasswordValid){
            throw new Error('Invalid Credentails');
        }
        // const token = jwt.sign({_id: user._id}, privateJWTKey, {expiresIn: '7D'});
        const token = user.getJWT();
        res.cookie("token", token, { expires: new Date(Date.now() + 1800000), sameSite: 'none', secure: true});
        res.json({
            message: 'User Logged in successfully.',
            data: user
        });
    } catch (error) {
        res.status(400).send('Error in logging user: ' + error.message);
    }
});

authRouter.get('/logout', (req, res) => {
    try {
        res.cookie('token', null,{expires: new Date(Date.now()), sameSite: 'none', secure: true});
        res.json({
            msg: 'User logged out successfuly'
        });
    } catch (error) {
        res.status(400).send('Log out failed.');
    }
});

module.exports = authRouter;