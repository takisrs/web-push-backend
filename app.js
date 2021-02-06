const express = require("express");

const app = express();

const bodyParser = require("body-parser");
const mongoose = require("mongoose");

app.use(bodyParser.json());

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	next();
});

const authRoutes = require("./routes/auth");
const subscriptionsRoutes = require("./routes/subscriptions");
const logsRoutes = require("./routes/logs");
const notificationsRoutes = require("./routes/notifications");
const imagesRoutes = require("./routes/images");
const cron = require('./utils/cron');
//cron();

app.use("/auth", authRoutes);
app.use("/subscriptions", subscriptionsRoutes);
app.use("/logs", logsRoutes);
app.use("/notifications", notificationsRoutes);
app.use("/images", imagesRoutes);

mongoose
	.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((result) => {
		app.listen(process.env.PORT || 3000);
	})
	.catch((err) => {
		throw err;
	});

app.use((error, req, res, next) => {
	console.log(error);
	const status = error.statusCode || 500;
	const message = error.message || "Error Occured";
	const errors = error.data || {};
	res.status(status).json({
		ok: false,
		message: message,
		data: errors,
	});
});
