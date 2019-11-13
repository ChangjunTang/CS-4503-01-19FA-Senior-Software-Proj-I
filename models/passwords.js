const fsRef = require('firebase-admin').firestore().collection('/passwords');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);

async function add(user, title, storedUsername, storedPassword) {
    if (!user || !title || !storedUsername || !storedPassword) {
        throw new MissingParameterError();
    }

    // TODO: Check that this actually does Escape/sanitize title, storedUsername, and storedPassword
    title = DOMPurify.sanitize(title);
    storedUsername = DOMPurify.sanitize(storedUsername);
    storedPassword = DOMPurify.sanitize(storedPassword);

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
        .get()
        .catch(function () {
            throw new QueryFailedError();
        });
}

function addPassword(user, title, storedUsername, storedPassword) {
    return fsRef
        .doc()
        .set({
            'user': user,
            'title': title,
            'storedUsername': storedUsername,
            'storedPassword': storedPassword
        })
        .catch(function () {
            throw new QueryFailedError();
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
        await deleteDocument(snapshot.docs[0].ref);
    }
}

function deleteDocument(docRef) {
    return docRef
        .delete()
        .catch(function () {
            throw new QueryFailedError();
        });
}

async function get(user) {
    if (!user) {
        throw new MissingParameterError();
    }

    const snapshot = await getAllPasswordsForUser(user);

    let passwords = [];

    snapshot.forEach(function (doc) {
        const data = doc.data();
        delete data.user;
        // TODO: decrypt all of the stuff before sending back to user
        passwords.push(data);
    });

    return passwords;
}

function getAllPasswordsForUser(user) {
    return fsRef
        .where('user', '==', user)
        .get()
        .catch(function () {
            throw new QueryFailedError();
        });
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

class QueryFailedError extends Error {
    constructor() {
        super('Database Query Failed');
        this.code = 400;
    }
}

module.exports = { add, get, remove };