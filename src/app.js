const express = require('express');

const app = express();

app.use('/', (req, res) => {
    res.send('Welcome to this server!');
});

app.listen(3000, () => {
    console.log('Server is listening from the port 3000 ...');
});