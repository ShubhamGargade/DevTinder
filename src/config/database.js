const mongoose = require('mongoose');

const connectDatabase = async() => {
    await mongoose.connect(`mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_KEY}@nodejslearning.zvoxw.mongodb.net/DevTinder;`);
}

module.exports = connectDatabase;