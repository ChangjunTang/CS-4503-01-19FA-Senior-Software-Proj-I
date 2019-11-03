const users = require('./users');
require('../firebase-config');
const admin = require('firebase-admin');

describe('creating an account', () => {
    test('creating an account should not throw an error', () => {
        return users.create('matthewparris@outlook.com', 'securePassword', 'securePassword')
            .then(function (data) {
                expect(data).toBe(undefined);
            })
            .then(function () {
                admin.auth().getUserByEmail('matthewparris@outlook.com')
                    .then(user => {
                        admin.auth().deleteUser(user.uid);
                    });
            });
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


});
