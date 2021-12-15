var admin = require("firebase-admin");

var serviceAccount = {
  "type": "service_account",
  "project_id": "tdtu-social-media-web",
  "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
  "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g,'\n'),
  "client_email": "firebase-adminsdk-29j3d@tdtu-social-media-web.iam.gserviceaccount.com",
  "client_id": "114073423452690687490",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-29j3d%40tdtu-social-media-web.iam.gserviceaccount.com"
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "tdtu-social-media.appspot.com",
});

const fBucket = admin.storage().bucket()

module.exports = {
  fBucket
}