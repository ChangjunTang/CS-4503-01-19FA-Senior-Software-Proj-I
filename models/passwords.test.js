require('../firebase-config.js');
const passwords = require('./passwords');

// TODO test for duplicates
describe('adding a password', () => {
    test('adding a password should not throw an error', async () => {
        return await passwords.add('test@test.com', 'Testing9', 'Tester9', 'password9');
    });
});

describe('getting a password', () => {
    test('getting a password from a stored user should not throw an error', () => {
        return passwords.getPassword('test@test.com', 'Testing', 'Tester');
    });

    test('getting a password from an unstored user should throw an error', () => {
        return passwords.getPassword('test@test.com', 'Testing', 'NotTester');
    });
});

describe('getting a user and their passwords', () => {
    test('getting a valid user should not throw an error', async () => {
        return await passwords.get('test@test.com');
    });

    test('when no user provided, throw an error', async () => {
        return await passwords.get()
            .catch(function (err) {
                  expect(err).toMatch("Missing Parameter");
            });
    });
});


// Jest + Jsdom causes problems with async functions
// Jest by default uses Jsdom's definition for setTimeout instead of Node's.
// This overwrites that so that everything should work properly.
setTimeout(function () {}).__proto__.unref = function () {}


