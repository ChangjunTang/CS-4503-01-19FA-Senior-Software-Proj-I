//const functions = require('firebase-functions');
//const admin = require('firebase-admin');
//admin.initializeApp(functions.config().firebase);
const passwords = require('./passwords');
const firebase = require('firebase');


// mock firebase-admin, firestore, collection
//jest.mock('firebase', () => {
//    return {
//        apiAuth: jest.fn(() => {
//            return {
//                firestore: async () => undefined,
// 				  collection: async (string) => undefined
//            }
//        })
//    }
//});


describe('adding a password', () => {
    test('adding a password should not throw an error', () => {
        return passwords.addPassword('test@test.com', 'Testing', 'Tester', 'password');
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
    test('getting a valid user should not throw an error', () => {
        return passwords.get('test@test.com');
    });


    test('when no user provided, throw an error', () => {
        expect.assertions(1);

        return passwords.get()
            .catch(function (err) {
                expect(err).toMatch('Missing Parameter');
            });
    });
});




