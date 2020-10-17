import { IDatabase } from './_abstract/IDatabase';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { IFirebaseConfig } from '../../../config';

export type DocumentReference<T = DocumentData> = firebase.firestore.DocumentReference;
export type DocumentData = firebase.firestore.DocumentData;

export class Database implements IDatabase {
  private _firebaseConfig: IFirebaseConfig;
  private _db: firebase.firestore.Firestore;

  constructor(config: IFirebaseConfig) {
    this._firebaseConfig = config;
    if (firebase.apps.length === 0) {
      firebase.initializeApp(config);
    }
    this._db = firebase.firestore();
  }

  queryDoc(docPath: string): DocumentReference<DocumentData> {
    return this._db.doc(docPath);
  }
}
