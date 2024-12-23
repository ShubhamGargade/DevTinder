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
app.use('/', (req, res) => {
    res.send("Hello Client");
})
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
    app.listen(3000, () => {
        console.log('Server is listening from the port 3000 ...');
    });
}).catch(() => {
    console.log('Error connecting db');
});