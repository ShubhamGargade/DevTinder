const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLenght: 50
    },
    lastName: {
        type: String,
        minLength: 3,
        maxLenght: 50
    },
    emailId: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        validate: function(value) {
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email Id.')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    gender: {
        type: String,
        validate(value) {
            if(!['Male', 'Female', 'Others'].includes(value)){
                throw new Error('Gender is not valid.');
            }
        }
    },
    age: {
        type :Number,
        min: 18,
        max: 100
    },
    about: {
        type: String,
        default: "This is the default about of the user."
    },
    skills: {
        type: [String]
    }
},{timestamps: true} );

userSchema.methods.getJWT = function() {
    const user = this;
    const tokenGenerated = jwt.sign({_id: user._id}, 'DevTinder@123', {expiresIn: '7D'});
    return tokenGenerated;
}

userSchema.methods.validatePassword = async function(userEnteredPassword) {
    const user = this;
    const userPasswordHash = user.password;
    const isValidPassword = await bcrypt.compare(userEnteredPassword, userPasswordHash);
    return isValidPassword;
}

module.exports = mongoose.model('User', userSchema);

