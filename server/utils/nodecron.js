const cron = require('node-cron');
const { sendExpiredFiles } = require('../controller/file_controller')


cron.schedule(' 5 10 * * *', async () => {
    console.log("nodecron entered")
    try {
        await sendExpiredFiles();
    } catch (error) {
        console.error("Error while running sendExpiredFiles:", error);
    }
}, {
    timezone: "Asia/Kolkata"
});
