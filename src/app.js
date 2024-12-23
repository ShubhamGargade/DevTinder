require('dotenv').config();
const express = require('express');
const connectionDB = require('./config/database.js');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

const authRouter = require('./routes/auth.js');
const profileRouter = require('./routes/profile.js');
const requestRouter = require('./routes/request.js');
const userRouter = require('./routes/user.js');

app.use(express.json()); //used to convert JSON to JS Obj for api body.
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}))

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);


// app.get('/feed', async (req, res, next) => {
//     try {
//         const users = await User.find({});
//         res.send(users);
//     } catch (error) {
//         res.status(400).send('Error in finding feed data.' + error.message);
//     }
// });

connectionDB().then(() => {
    console.log('database connected ...');
    app.listen(process.env.PORT, () => {
        console.log(`Server is listening from the port ${process.env.PORT} ...`);
    });
}).catch((error) => {
    console.log('Error connecting db', error);
});

module.exports = app;