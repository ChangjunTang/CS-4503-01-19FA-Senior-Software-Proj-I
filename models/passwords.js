const fsRef = require('firebase-admin').firestore().collection('/passwords');
const encrypt = require('../utilities/encrypt');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);

function sanitize(str) {
    return DOMPurify.sanitize(str, { ALLOWED_TAGS: [] });
}

async function add(user, title, storedUsername, storedPassword) {
    title = sanitize(title || '');
    storedUsername = sanitize(storedUsername || '');
    storedPassword = sanitize(storedPassword || '');

    if (!user || !title || !storedUsername || !storedPassword) {
        throw new MissingParameterError();
    }

    const snapshot = await getPassword(user, title, storedUsername)

    if (snapshot.empty) {
        storedPassword = encrypt.encrypt(storedPassword);
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
    title = sanitize(title || '');
    storedUsername = sanitize(storedUsername || '');

    if (!user || !title || !storedUsername) {
        throw new MissingParameterError();
    }

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
        data.storedPassword = encrypt.decrypt(data.storedPassword);
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