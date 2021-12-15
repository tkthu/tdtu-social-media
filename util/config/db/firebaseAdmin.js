var admin = require("firebase-admin");

var serviceAccount = require("../../../credentials/tdtu-social-media-firebase-adminsdk-5py4q-e584e5a09f.json");


serviceAccount = {
  "type": "service_account",
  "project_id": "tdtu-social-media",
  "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
  "private_key": process.env.FIREBASE_PRIVATE_KEY.replace('\\n','\n'),
  "client_email": "firebase-adminsdk-5py4q@tdtu-social-media.iam.gserviceaccount.com",
  "client_id": "107926622862175199695",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-5py4q%40tdtu-social-media.iam.gserviceaccount.com"
}
// serviceAccount.private_key_id = 
// // serviceAccount.private_key = process.env.FIREBASE_PRIVATE_KEY.replace(/['"]+/g, '')

console.log('serviceAccount', serviceAccount)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "tdtu-social-media.appspot.com",
});

const fBucket = admin.storage().bucket()

module.exports = {
  fBucket
}