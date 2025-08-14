const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;

// Use a hardcoded UID for testing. Replace with a valid UID from your Firebase project.
const testUid = 'test-uid'; // Replace with a valid user UID for testing

admin.auth().getUser(testUid)
  .then((userRecord) => {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log('Successfully fetched user', userRecord.toJSON());
  })
  .catch((error) => {
    console.log('Error fetching user', error);
  });
