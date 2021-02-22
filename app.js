const apm = require('elastic-apm-node');
apm.start()

const express = require("express");
const compression = require('compression');
const path = require("path");
const i18n = require('i18n');

const app = express();

const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const config = require('./config/config');

app.use(compression());

app.use(bodyParser.json());

app.use("/resources", express.static(path.join(__dirname, 'resources')));

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	next();
});

i18n.configure({
	locales: config.localization.locales,
	defaultLocale: config.localization.default,
	retryInDefaultLocale: true,
	header: 'accept-language',
	autoReload: false,
	updateFiles: true,
	syncFiles: false,
	directory: path.join(__dirname, 'locales')
});

app.use(i18n.init);

const authRoutes = require("./routes/auth");
const subscriptionsRoutes = require("./routes/subscriptions");
const logsRoutes = require("./routes/logs");
const notificationsRoutes = require("./routes/notifications");
const imagesRoutes = require("./routes/images");
const scriptsRoutes = require("./routes/scripts");


const cron = require('./utils/cron');
cron();

app.use("/auth", authRoutes);
app.use("/subscriptions", subscriptionsRoutes);
app.use("/logs", logsRoutes);
app.use("/notifications", notificationsRoutes);
app.use("/images", imagesRoutes);
app.use("/scripts", scriptsRoutes);

mongoose
	.connect(`mongodb+srv://${config.mongodb.user}:${config.mongodb.password}@${config.mongodb.host}/${config.mongodb.database}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((result) => {
		app.listen(config.server.port);
	})
	.catch((err) => {
		throw err;
	});

app.use((error, req, res, next) => {
	console.log(error);
	const status = error.statusCode || 500;
	const message = error.message || i18n.__("Error Occured");
	const errors = error.data || {};
	res.status(status).json({
		ok: false,
		message: message,
		data: errors,
	});
});
