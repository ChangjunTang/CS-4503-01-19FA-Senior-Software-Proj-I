require('../firebase-config.js');
const passwords = require('./passwords');

describe('testing remove passwords', () => {
    test('removing a valid password should not throw an error', async () => {
        await passwords.add('testing@testing.com', 'unitTestEx1', 'storedUser', "passwordTesting").then( async () => {
            return await passwords.remove('testing@testing.com', 'unitTestEx1', 'storedUser');
        })
        
    });

    test('when not a valid password, throw an error', async () => {
        await expect( passwords.remove('a@testing.com', 'NOTunitTestEx', 'NOTstoredUser') ).rejects.toThrow("Password Entry Does Not Exist");
    });

});

// Jest + Jsdom causes problems with async functions
// Jest by default uses Jsdom's definition for setTimeout instead of Node's.
// This overwrites that so that everything should work properly.
setTimeout(function () {}).__proto__.unref = function () {} 