const nodeSchedule = require("node-schedule");
const sendMessage = require("./firebaseCloudMessaging");
const Timezone = require("../models/Timezone");

const startupSchedule = async () => {
  const timezones = await Timezone.find({}).exec();
  timezones.forEach((tz) => {
    const rule = new nodeSchedule.RecurrenceRule();
    rule.hour = [8, 10, 12, 14, 16, 18, 20];
    rule.minute = 30;
    rule.tz = tz.timezone;

    nodeSchedule.scheduleJob(rule, function () {
      sendMessage(tz.topic);
    });
  });
};

module.exports = { startupSchedule };
