const mongoose = require('mongoose');
const {config} = require('../utils/constants.js')

const connectDatabase = async() => {
    await mongoose.connect(`mongodb+srv://NodeJsLearning:${config.databaseKey}@nodejslearning.zvoxw.mongodb.net/DevTinder;`);
}

module.exports = connectDatabase;