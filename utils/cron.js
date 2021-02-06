const cron = require('node-cron');

const setupCron = () => {
    cron.schedule('*/5 * * * * *', () => {
        console.log('running a task every 5 sec');
    });
}

module.exports = setupCron;