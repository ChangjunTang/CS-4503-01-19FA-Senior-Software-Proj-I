const config = {
    apiKey: "AIzaSyDcPUV7GN5aLzWnUrst7-pU0WHNxta0Qbs",
    authDomain: "jjbp-bot.firebaseapp.com",
    databaseURL: "https://jjbp-bot.firebaseio.com",
    projectId: "jjbp-bot",
    storageBucket: "jjbp-bot.appspot.com",
    messagingSenderId: "757073654109"
};

const admin = require('firebase-admin');
const key = require('./serviceAccountKey.json');
const adminConfig = {
    credential: admin.credential.cert(key),
    databaseURL: 'https://jjbp-bot.firebaseio.com'
};

require('firebase').initializeApp(config);
admin.initializeApp(adminConfig);