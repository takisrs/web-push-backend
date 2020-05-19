const express = require('express');

const app = express();

const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const config = require("./config.json");

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

const subscriptionsRoutes = require('./routes/subscriptions');
const notificationsRoutes = require('./routes/notifications');

app.use('/subscriptions', subscriptionsRoutes);
app.use('/notifications', notificationsRoutes);


mongoose.connect('mongodb+srv://panos:panathinaikos@cluster0-0ednp.mongodb.net/push-notifications?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }).then(result => {
    app.listen(config.port);
}).catch(err => console.log(err));
