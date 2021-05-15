var admin = require("firebase-admin");

var serviceAccount = require("../../../credentials/tdtu-social-media-firebase-adminsdk-5py4q-e584e5a09f.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "tdtu-social-media.appspot.com",
});

const fBucket = admin.storage().bucket()

module.exports = {
  fBucket
}