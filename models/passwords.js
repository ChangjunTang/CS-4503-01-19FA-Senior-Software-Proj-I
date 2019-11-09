const fsRef = require('firebase-admin').firestore().collection('/passwords');

// TODO: Add better error checking? What happens if a query fails....

async function add(user, title, storedUsername, storedPassword) {
    if (!user || !title || !storedUsername || !storedPassword) {
        throw new MissingParameterError();
    }

    // TODO: Escape/sanitize title, storedUsername, and storedPassword

    const snapshot = await getPassword(user, title, storedUsername)

    if (snapshot.empty) {
        // TODO: At bare minimum, the password needs to encrypted
        // The other fields can be encrypted, but that makes everything more complicated
        await addPassword(user, title, storedUsername, storedPassword);
    }
    else {
        throw new DuplicatePasswordError();
    }
}

function getPassword(user, title, storedUsername) {
    return fsRef
        .where('user', '==', user)
        .where('storedUsername', '==', storedUsername)
        .where('title', '==', title)
        .get();
}

function addPassword(user, title, storedUsername, storedPassword) {
    return fsRef
        .doc()
        .set({
            'user': user,
            'title': title,
            'storedUsername': storedUsername,
            'storedPassword': storedPassword
        });
}

async function remove(user, title, storedUsername) {
    if (!user || !title || !storedUsername) {
        throw new MissingParameterError();
    }

    // TODO: Escape/sanitize title and storedUsername
    // I don't think this one is as important but might as well do it

    const snapshot = await getPassword(user, title, storedUsername);

    if (snapshot.empty) {
        throw new PasswordEntryDoesNotExistError();
    }
    else {
        await snapshot.docs[0].ref.delete();
    }
}

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
        // TODO: decrypt all of the stuff before sending back to user
        passwords.push(data);
    });

    return passwords;
}

class MissingParameterError extends Error {
    constructor() {
        super("Missing Parameter");
        this.code = 400;
    }
}

class DuplicatePasswordError extends Error {
    constructor() {
        super('Duplicate Password');
        this.code = 400;
    }
}

class PasswordEntryDoesNotExistError extends Error {
    constructor() {
        super('Password Entry Does Not Exist');
        this.code = 404;
    }
}

module.exports = { add, get, remove };