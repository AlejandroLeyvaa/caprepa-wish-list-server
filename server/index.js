const express = require('express');
const cors = require('cors');
const config = require('./config/index')
const wishList = require('./api/components/wish-list/network.js');
const users = require('./api/components/users/network.js');
const departments = require('./api/components/departments/network.js');

require('dotenv').config();

const app = express();

app.use(express.json({ limit: '15mb', extended: true }));
app.use(express.urlencoded({ extended: true }))
// app.use(cors({
//     origin: 'https://caprepa-gifts-list.netlify.app',
// }));
app.use(cors());


app.use('/', (req, res, next) => {
    res.send({
        "Hello": "Wolrd",
    })
});
app.use(express.static('public'));
app.use('/api/wish-list', wishList);
app.use('/api/auth/users', users);
app.use('/api/auth/departments', departments);

app.listen(config.port, () => {
    console.log(`http://localhost:${config.port}`);
});