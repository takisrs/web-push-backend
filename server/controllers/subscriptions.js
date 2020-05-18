const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://panos:panathinaikos@cluster0-0ednp.mongodb.net/push-notifications?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

exports.postSubscription = (req, res, next) => {
    const subscription = req.body.subscription;

    client.connect(err => {
        if (err) throw err;
        const subscriptions = client.db("push-notifications").collection("subscriptions");
        subscriptions.insertOne(subscription, (err, record) => {
            if (err) throw err;
            console.log(record);
            client.close();
        });
    });

    res.status(201).json({
        message: 'Subscription created successfully!',
        data: subscription
    });
};