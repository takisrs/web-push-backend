const apm = require('elastic-apm-node');
apm.start();

const express = require('express');
const compression = require('compression');
const path = require('path');
const i18n = require('i18n');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');

const config = require('./config/config');
const cron = require('./utils/cron');
const logger = require('./utils/logger');

app.use(compression());
app.use(bodyParser.json());
app.use('/resources', express.static(path.join(__dirname, 'resources')));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, COPY, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

cron();

i18n.configure({
  locales: config.localization.locales,
  defaultLocale: config.localization.default,
  retryInDefaultLocale: true,
  header: 'accept-language',
  autoReload: false,
  updateFiles: true,
  syncFiles: false,
  directory: path.join(__dirname, 'locales'),
});

app.use(i18n.init);

const authRoutes = require('./routes/auth');
const subscriptionsRoutes = require('./routes/subscriptions');
const logsRoutes = require('./routes/logs');
const notificationsRoutes = require('./routes/notifications');
const imagesRoutes = require('./routes/images');
const scriptsRoutes = require('./routes/scripts');

app.use(helmet());

app.use('/auth', authRoutes);
app.use('/subscriptions', subscriptionsRoutes);
app.use('/logs', logsRoutes);
app.use('/notifications', notificationsRoutes);
app.use('/images', imagesRoutes);
app.use('/scripts', scriptsRoutes);

mongoose
  .connect(
    `mongodb+srv://${config.mongodb.user}:${config.mongodb.password}@${config.mongodb.host}/${config.mongodb.database}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
  )
  .then((_result) => {
    app.listen(config.server.port);
  })
  .catch((err) => {
    throw err;
  });

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message || i18n.__('Error Occured');
  const errors = error.data || {};

  logger.info(`${error.statusCode} - ${message}`);

  res.status(status).json({
    ok: false,
    message,
    data: errors,
  });
});
