import * as admin from 'firebase-admin';
import * as serviceAccount from '../../service-account.json';

admin.initializeApp({
  credential: admin.credential.cert(<any>serviceAccount)
});

const db = admin.firestore();

export default db;