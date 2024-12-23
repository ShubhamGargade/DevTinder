const mongoose = require('mongoose');

const connectDatabase = async() => {
    await mongoose.connect(`mongodb+srv://NodeJsLearning:${process.env.DATABASE_KEY}@nodejslearning.zvoxw.mongodb.net/DevTinder;`);
}

module.exports = connectDatabase;