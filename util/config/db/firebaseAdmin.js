var admin = require("firebase-admin");

var serviceAccount = require("../../../credentials/tdtu-social-media-firebase-adminsdk-5py4q-e584e5a09f.json");


serviceAccount = {
  "type": "service_account",
  "project_id": "tdtu-social-media",
  "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC5IvyStn/Q1Hhe\nUpDo2VMgJSLuMxzym62Wl9MvGUZBLBwPwxCgQZbgJOZ9+xEWx9fC0IhZuqf5HQ6g\nlFJgQukNknSc3LKQORgr3p4tw8X9x90i98XkTfXLhOAZMvxA8qu3iUhHhVMylYgW\nkKl6sUQROxt6Z3i+xVcgsk0nO4gHnZDfAvYQoaJx+wJHKbGi0DHkk1L/MiYpgkpc\nqFP8yj7LKDJLnxG8PbFITcaUGZDJUHPvD4g73wGLYOdkwux7hOVuap/o8cBtGnur\n/SZ1p3J33RGq8Zel8LZ9kLQHwz9la+MI4amQ8DtfqAEejJKMazppsjyB4hAknCGa\nH5cDxQO3AgMBAAECggEAVTSG7bbUaHYA19hEHQY4PakZxGr9vaJsZ8yEQz7smH4G\nhDKQalEFcS9KbVypZsSexmhW+ITxXbND0h+xMeBZhgeLZ84i2EGOoFIalpFtg/kC\nC1/hUcuXfg0vXima8wE8ioHCJDh2K+ep9Eir123SF+QOJ22LorEMAl5NJ+s8FdRj\nPIWXdx9sV6kk73SCEJTQliozvhwdr92lirurZvp0y5ccjZfSUxhp3avLtlTRgNrA\nYwguG6bmrhp/FMWWMRDHhwgEnJgutnF8Mjo7H02wRFip5m/y7LdcDx9aYNP2v5+d\ntsMihcFmKpnP4Ls4Pt4qx1mfI4CHXRLXgucTl32J4QKBgQDwqKo4T05290/jOuOV\nwy5Vx/lWZvYYFtSvXrp7Wx0CeaqwAKUrPu1cYOLvO+mRa8U45Dc4P5fnF5GtxvUW\nXPj3lpPxKMuz18/l2ppOYcDBf5aiU74IDrOpUztxasTf2i7KgLsPf655aiYUY4Q2\nigcN4tEi41m+0vNJmqPe7wAv/wKBgQDE8D/1NNllTcYfmmBW3pKFfzg2IyRpF9PF\nMERDygthgpmIkVFBINPlkHC4Qx30WfXBVVxENMvCmST9XIM0xDKIn289b+9ckGaf\nXDzta1UeCK6bwT7azSYPiatt90OIcK/I2RSUmAn+1NSw1pLiVO/un4YKwbDHWXu4\nHwA4w4isSQKBgGVKmFqbBquL7FP3tVKTlC0GvitfqrT45wvpExRYhR1FmFH784kA\nM2duYBXRYb2TXq9TXuqN2aGqieZal02SVDfhaONYCGTpsNdN6ySSgE7xJLWuCY3a\nokPihGJ4TeTqMEeLZzBezVDNHLn4KO3LqqxtixjkGCH5J+0S6WYrsiiBAoGAcPzl\ntOj9UQGuCbOoUi6gIbc7qNPAsArblOZ8Q+hHX0pui8vTsmoDKFIWWaEoLmjudl1i\n8j7YKG10q2fIXx2xYHEYgUcXLSQrvIJO8mgCDZktlG7qgN3yWDfEAvM56627LKBf\nDmGsWmgBHvP8kZ3pih476S/3HGhacuhWWDrWzwECgYEAgXpG37Xq2nbHDTL6OfJO\nwPB5i7U0nhc5ZmOHX2D4QJLf9XykKM/XMHVdz1tnet7mvjv6m6HHNhYyL2WW3qkW\nEkANQClpP6aK/ZdyUGEi3DI1s43zXlgIQp9/spYrOu+anJbsEHLacm7PMBESxVyg\nQd2PaFHfIwmI391i/NaeWRc=\n-----END PRIVATE KEY-----\n",
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