const express = require('express');
const profileRouter = express.Router();
const { adminAuth } = require('../middlewares/auth.js');
const User = require('../model/user.js');
const bcrypt = require('bcrypt');

profileRouter.get("/profile/view", adminAuth, async(req, res) => {
    try {
        res.send(req.user);
    } catch (error) {
        res.status(400).send("Error for getting profile" + error.message);
    }
});

profileRouter.patch("/profile/edit", adminAuth, async(req, res) => {
    try {
        const allowedFields = ['age', 'about', 'skills'];
        const isDataEditable = Object.keys(req.body).every(field => allowedFields.includes(field));        
        if(!isDataEditable){
            throw new Error('Enter valid data');
        }
        Object.keys(req.body).forEach(field => req.user[field] = req.body[field]);
        // User.findByIdAndUpdate(req.user['_id'], req.body);
        req.user.save()
        res.send('Successfully edited');
    } catch (error) {
        res.status(400).send("Error for getting profile" + error.message);
    }
});

profileRouter.patch("/profile/changepassword", adminAuth, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const currentPasswordValid = await req.user.validatePassword(currentPassword);
        if(!currentPasswordValid){
            throw new Error("Current Passsword is invalid.");
        }
        if(currentPassword === newPassword){
            throw new Error("Current password not allowed.")
        }
        req.user.password = await bcrypt.hash(newPassword, 10);
        req.user.save();
        res.send('Password changed successfully.')
    } catch (error) {
        res.status(400).send('Error: ' + error.message);
    }
})

module.exports = profileRouter;