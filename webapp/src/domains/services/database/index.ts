import { IDatabase } from './_abstract/IDatabase';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { IFirebaseConfig } from '../../../config';

export type CollectionReference<T = DocumentData> = firebase.firestore.CollectionReference<T>;
export type DocumentReference<T = DocumentData> = firebase.firestore.DocumentReference<T>;
export type DocumentData = firebase.firestore.DocumentData;
export type DocumentSnapshot<T = DocumentData> = firebase.firestore.DocumentSnapshot<T>;
export type QuerySnapshot<T = DocumentData> = firebase.firestore.QuerySnapshot<T>;

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

  setDoc(collPath: string, data: {[key: string]: any}): Promise<DocumentReference<{[key: string]: any}>> {
    return this._db.collection(collPath).add(data);
  }

  getCollection(collPath: string): CollectionReference<DocumentData> {
    return this._db.collection(collPath);
  }
}
