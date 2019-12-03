const crypto = require('crypto');

function encrypt(key, algorithm, text) {
    try {
        const cipher = crypto.createCipher(algorithm, key);
        return Buffer.concat([
            cipher.update(text),
            cipher.final()
        ]).toString('base64');
    }
    catch (err) {
        throw new EncryptError();
    }
}

function decrypt(key, algorithm, text) {
    try {
        const decipher = crypto.createDecipher(algorithm, key);
        return Buffer.concat([
            decipher.update(text, 'base64'),
            decipher.final()
        ]).toString();
    }
    catch (err) {
        return '';
    }
}

const loadKey = (function () {
    let cache = null;

    return function () {
        if (cache) {
            return cache;
        }
        else {
            cache = require('../aesKey.json').key;
            return cache;
        }
    }
})();

class EncryptError extends Error {
    constructor() {
        super('Encryption failed');
    }
}

module.exports = {
    encrypt: encrypt.bind(null, loadKey(), 'aes256'),
    decrypt: decrypt.bind(null, loadKey(), 'aes256')
}