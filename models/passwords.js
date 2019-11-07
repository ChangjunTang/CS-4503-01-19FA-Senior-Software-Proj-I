// const passwords = {};
// const firebase = require('firebase');
const fsRef = require('firebase-admin').firestore().collection('/passwords');

async function add(user, title, storedUsername, storedPassword) {
    if (!user || !title || !storedUsername || !storedPassword) {
        throw new MissingParameterError();
    }

    // if (!passwords[user]) {
    //     passwords[user] = []
    // }

    const snapshot = await fsRef
        .where('user', '==', user)
        .where('storedUsername', '==', storedUsername)
        .where('title', '==', title)
        .get();

    if (snapshot.empty) {
        await fsRef
            .doc()
            .set({
                'user': user,
                'title': title,
                'storedUsername': storedUsername,
                'storedPassword': storedPassword
            });
    }
    else {
        throw new Error('Duplicate Password');
    }

    // if (passwords[user].find(entry => entry.storedUsername == storedUsername && entry.title == title)) {
    //     throw new Error('Duplicate Password');
    // }
    // else {
    //     var firebaseUser = firebase.auth().currentUser;
    //     if (firebaseUser) {
    //         addPassword(firebaseUser.uid, title, storedUsername, storedPassword);
    //     }
    //     passwords[user].push({ title, storedPassword, storedUsername })
    // }
}

async function remove(user, title, storedUsername) {
    if (!user || !title || !storedUsername) {
        throw new MissingParameterError();
    }

    const snapshot = await fsRef
        .where('user', '==', user)
        .where('title', '==', title)
        .where('storedUsername', '==', storedUsername)
        .get()

    if (snapshot.empty) {
        throw new Error('Password Entry Does Not Exist');
    }
    else {
        await snapshot.docs[0].ref.delete();
    }

    // if (!passwords[user]) {
    //     throw new Error('No Passwords Stored');
    // }

    // for (let ii = 0; ii < passwords[user].length; ii++) {
    //     entry = passwords[user][ii];
    //     if (entry.storedUsername == storedUsername && entry.title == title) {
    //         passwords[user].splice(ii, 1);
    //         return;
    //     }
    // }

    // throw new Error('Password Entry Does Not Exist');
}

// function addPassword(userId, title, username, password) {
//     var temp = userId + title;
//     firebase.database().ref('users/' + userId).push({
//         website: title,
//         username: username,
//         password: password
//     });
// }

async function get(user) {
    if (!user) {
        throw new MissingParameterError();
    }

    const snapshot = await fsRef
        .where('user', '==', user)
        .get()

    let passwords = [];

    snapshot.forEach(function (doc) {
        const data = doc.data();
        delete data.user;
        passwords.push(data);
    });

    return passwords;
    // return passwords[user];
}

class MissingParameterError extends Error {
    constructor() {
        super("Missing Parameter");
    }
}

module.exports = { add, get, remove };