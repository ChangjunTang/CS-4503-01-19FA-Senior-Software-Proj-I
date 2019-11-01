const users = require('./users');
const firebase = require('../firebase-config');

describe('creating an account', () => {
    beforeEach(() => {
        firebase.auth().
        const user = firebase.auth().getUserByEmail('testuser@test.com')
            .catch(function (err) {
                if (err.code !== 'auth/user-not-found') {
                    throw err;
                }
            });
        console.log(user);
        firebase.auth().delete(user.uid);
    });

    test('when passwords do not match, throw an error', () => {
        expect.assertions(1);
        return users.create('newUser', '1', '2')
            .catch(function (err) {
                expect(err).toMatch('mismatched_pws');
            });
    });

    test('username is already taken, throw an error', () => {
        expect.assertions(1);
        return users.create('mfrogparris@gmail.com', 'someLongPassword', 'someLongPassword')
            .catch(function (err) {
                expect(err).toMatch('email_already_in_use');
            });
    });

    test('when given an invalid email, throw an error', () => {
        expect.assertions(1);
        return users.create('notAnEmail', 'someLongPassword', 'someLongPassword')
            .catch(function (err) {
                expect(err).toMatch('invalid_email');
            });
    });

    test('creating an account should not throw an error', () => {
        return users.create('testuser@test.com', 'securePassword', 'securePassword')
            .then(function (data) {
                expect(data).toBe(undefined);
            });
    });

});
