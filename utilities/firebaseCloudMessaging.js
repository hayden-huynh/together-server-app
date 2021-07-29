const admin = require("firebase-admin");
const promiseRetry = require("promise-retry");

const serviceAccount = require("../firebaseServiceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendMessage = (topic) => {
  promiseRetry(function (retry, attemptNo) {
    console.log(`Message sending attempt ${attemptNo}`);
    return admin
      .messaging()
      .send({
        data: {
          desc: "Follow-up Reminder Notification",
        },
        android: {
          priority: "high",
          ttl: 3600000,
        },
        apns: {
          payload: {
            aps: {
              contentAvailable: true,
            },
          },
          headers: {
            "apns-push-type": "background",
            "apns-priority": "5",
            "apns-topic": "io.flutter.plugins.firebase.messaging",
            "apns-expiration": `${Math.floor((Date.now() + 3600000) / 1000)}`,
          },
        },
        topic: topic,
      })
      .catch(retry);
  }).then(
    function (_) {
      const timestamp = new Date();
      console.log(
        `${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()} | ${timestamp.getDate()}-${
          timestamp.getMonth() + 1
        }-${timestamp.getFullYear()}: Successfully sent message`
      );
    },
    function (reason) {
      console.log(`Unsuccessful after all retries: ${reason}`);
    }
  );
};

module.exports = sendMessage;
