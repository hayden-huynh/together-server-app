const nodeSchedule = require("node-schedule");
const sendMessage = require("./firebaseCloudMessaging");
const Timezone = require("../models/Timezone");

const startupSchedule = async () => {
  const timezones = await Timezone.find({}).exec();
  timezones.forEach((tz) => {
    const rule = new nodeSchedule.RecurrenceRule();
    rule.hour = [9, 11, 13, 15, 17, 19, 21];
    rule.minute = 0;
    rule.tz = tz.timezone;

    nodeSchedule.scheduleJob(rule, function () {
      sendMessage(tz.topic);
    });
  });
};

module.exports = { startupSchedule };
