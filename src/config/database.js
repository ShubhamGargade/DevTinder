const mongoose = require('mongoose');
const {databaseKey} = require('../utils/constants.js')

const connectDatabase = async() => {
    await mongoose.connect(`mongodb+srv://NodeJsLearning:${databaseKey}@nodejslearning.zvoxw.mongodb.net/DevTinder;`);
}

module.exports = connectDatabase;