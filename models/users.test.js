const users = require('./users');
const firebase = require('firebase');

jest.mock('firebase', () => {
    return {
        auth: jest.fn(() => {
            return {
                createUserWithEmailAndPassword: async (email, password) => undefined
            }
        })
    }
});

describe('creating an account', () => {
    test('creating an account should not throw an error', () => {
        return users.create('test@test.com', 'securePassword', 'securePassword');
    });

    test('when passwords do not match, throw an error', () => {
        expect.assertions(1);

        return users.create('newUser', '1', '2')
            .catch(function (err) {
                expect(err).toMatch('mismatched_pws');
            });
    });

    test('username is already taken, throw an error', () => {
        firebase.auth.mockImplementation(() => {
            return {
                createUserWithEmailAndPassword: async (email, password) => {
                    const error = new Error();
                    error.code = 'auth/email-already-in-use';
                    throw error;
                }
            }
        });

        expect.assertions(1);

        return users.create('test@test.com', 'someLongPassword', 'someLongPassword')
            .catch(function (err) {
                expect(err).toMatch('email_already_in_use');
            });
    });

    test('when given an invalid email, throw an error', () => {
        firebase.auth.mockImplementation(() => {
            return {
                createUserWithEmailAndPassword: async (email, password) => {
                    const error = new Error();
                    error.code = 'auth/invalid-email';
                    throw error;
                }
            }
        });

        expect.assertions(1);

        return users.create('notAnEmail', 'someLongPassword', 'someLongPassword')
            .catch(function (err) {
                expect(err).toMatch('invalid_email');
            });
    });


});
