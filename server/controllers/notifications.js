const webpush = require('web-push');
const config = require("../config.json");

webpush.setVapidDetails(
  'mailto:'+config.email,
  config.vapidPublicKey,
  config.vapidPrivateKey
);

const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://panos:panathinaikos@cluster0-0ednp.mongodb.net/push-notifications?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

exports.sendNotification = (req, res, next) => {

    client.connect(err => {
        if (err) throw err;
        const subscriptions = client.db("push-notifications").collection("subscriptions");
        subscriptions.findOne({}, (err, subscription) => {
            if (err) throw err;
            console.log(subscription);

            webpush.sendNotification(subscription, JSON.stringify({title: "Hi!", message: "Hello from Node Js"})).then(result => {
                console.log(result);
                res.status(201).json({
                    message: 'Notification send!',
                    data: {}
                });
            }).catch(err => {
                console.log(err);
            });
            client.close();
        });
    });


};