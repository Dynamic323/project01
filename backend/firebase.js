const admin = require("firebase-admin");
const serviceAccount = require("./sharex-9d495-firebase-adminsdk-fbsvc-64c513cbe7.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
