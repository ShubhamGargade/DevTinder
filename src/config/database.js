const mongoose = require('mongoose');

const connectDatabase = async() => {
    await mongoose.connect('mongodb+srv://NodeJsLearning:OrpzcTABMzkYCKNQ@nodejslearning.zvoxw.mongodb.net/DevTinder;');
}

module.exports = connectDatabase;