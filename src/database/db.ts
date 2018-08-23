import * as admin from 'firebase-admin';
import * as serviceAccount from '../../service-account.json';

admin.initializeApp({
  credential: admin.credential.cert(<any>serviceAccount)
});

const Firestore = admin.firestore;
const db = Firestore();
db.settings({
  timestampsInSnapshots: true
});

export {
  Firestore,
  db,
};