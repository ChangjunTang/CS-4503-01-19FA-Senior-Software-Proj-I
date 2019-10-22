const firebase = require('firebase');

function authenticate(username, password) {
    return firebase.auth().signInWithEmailAndPassword(username, password);
}

function create(username, password1, password2) {
    return new Promise(async function (resolve, reject) {
        if (password1 !== password2) {
            reject({
                code: "mismatched_pws",
                message: "Provided passwords need to match"
            });
        }
        else {
            try {
                await firebase.auth().createUserWithEmailAndPassword(username, password1);
                resolve();
            }
            catch (err) {
                reject(err);
            }
        }
    });
}

function password_reset(username) {
	return new Promise(async function (resolve, reject) {
		try {
			await firebase.auth().sendPasswordResetEmail(username);
			resolve();
		}
		catch (err) {
			reject(err);
		}
    });
}

module.exports = { authenticate, create, password_reset }