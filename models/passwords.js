const passwords = {};
const firebase = require('firebase');

function add(user, title, storedUsername, storedPassword) {
    if (!user || !title || !storedUsername || !storedPassword) {
        throw new MissingParameterError();
    }

    if (!passwords[user]) {
        passwords[user] = []
    }

    if (passwords[user].find(entry => entry.storedUsername == storedUsername && entry.title == title)) {
        throw new Error('Duplicate Password');
    }
    else {
        var firebaseUser = firebase.auth().currentUser;
        if (firebaseUser) {
            addPassword(firebaseUser.uid, title, storedUsername, storedPassword);
        }
        passwords[user].push({ title, storedPassword, storedUsername })
    }
}

function remove(user, title, storedUsername) {
    if (!user || !title || !storedUsername) {
        throw new MissingParameterError();
    }

    if (!passwords[user]) {
        throw new Error('No Passwords Stored');
    }

    for (let ii = 0; ii < passwords[user].length; ii++) {
        entry = passwords[user][ii];
        if (entry.storedUsername == storedUsername && entry.title == title) {
            passwords[user].splice(ii, 1);
            return;
        }
    }

    throw new Error('Password Entry Does Not Exist');
}

function addPassword(userId, title, username, password) {
    var temp = userId + title;
    firebase.database().ref('users/' + userId).push({
        website: title,
        username: username,
        password: password
    });
  }

function get(user) {
    if (!user) {
        throw new MissingParameterError();
    }

    return passwords[user];
}

class MissingParameterError extends Error {
    constructor() {
        super("Missing Parameter");
    }
}

module.exports = { add, get, remove };