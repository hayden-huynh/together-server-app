const mongoose = require("mongoose");
const nodeSchedule = require("node-schedule");

const sendMessage = require("../utilities/firebaseCloudMessaging");

const timezoneSchema = mongoose.Schema({
  timezone: {
    type: String,
    unique: true,
  },
  topic: {
    type: String,
  },
});

timezoneSchema.post("save", function (doc, next) {
  const rule = new nodeSchedule.RecurrenceRule();
  rule.hour = [8, 10, 12, 14, 16, 18, 20];
  rule.minute = 30;
  rule.tz = doc.timezone;
  nodeSchedule.scheduleJob(rule, function () {
    sendMessage(doc.topic);
  });
  next();
});

const Timezone = mongoose.model("timezone", timezoneSchema);

module.exports = Timezone;
