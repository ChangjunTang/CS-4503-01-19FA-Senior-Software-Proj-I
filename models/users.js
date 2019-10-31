const firebase = require('firebase');

function authenticate(username, password) {
    return firebase.auth().signInWithEmailAndPassword(username, password);
}

function create(username, password1, password2) {
    return new Promise(async function (resolve, reject) {
        if (password1 !== password2) {
            reject("mismatched_pws");
        }
        else {
            try {
                await firebase.auth().createUserWithEmailAndPassword(username, password1);
                resolve();
            }
            catch (err) {
                let code = 'unexpected_err';

                if (err.code === 'auth/email-already-in-use') {
                    code = 'email_already_in_use';
                }
                else if (err.code === 'auth/invalid-email') {
                    code = 'invalid_email';
                }
                else if (err.code === 'auth/weak-password') {
                    code = 'weak_password';
                }

                reject(code);
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