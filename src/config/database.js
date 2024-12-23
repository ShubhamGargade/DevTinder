const mongoose = require('mongoose');

const connectDatabase = async() => {
    await mongoose.connect(`mongodb+srv://vercel-admin-user:TMqU4zqpVmfNGP61@nodejslearning.zvoxw.mongodb.net/DevTinder;`);
}

module.exports = connectDatabase;