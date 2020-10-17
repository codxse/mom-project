import { IAuthentication } from './_abstract/IAuthentication';
import { User } from '../../../models/user';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { IFirebaseConfig } from '../../../config';


export class Authentication implements IAuthentication<User, any> {
  private _firebaseConfig: IFirebaseConfig;
  private _auth: firebase.auth.Auth;

  constructor(config: IFirebaseConfig) {
    this._firebaseConfig = config;
    if (firebase.apps.length === 0) {
      firebase.initializeApp(config);
    }
    this._auth = firebase.auth();
  }

  async loginWithGoogle(): Promise<User> {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    return new Promise<User>(async (resolve, reject) => {
      try {
        await this._auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        const userCredential: firebase.auth.UserCredential = await this._auth.signInWithPopup(provider);
        const user: firebase.User | null = userCredential.user;
        if (user) {
          const myUser: User = new User(user.uid, user?.displayName || "Zenness", null, user.email, user.photoURL);
          resolve(myUser);
        } else {
          reject(new Error("User not found"));
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  onUserAuth(): Promise<User> {
    return new Promise<User>(async (resolve, reject) => {
      this._auth.onAuthStateChanged(user => {
        if (user) {
          resolve(new User(user.uid, user.displayName || "Zenness", null, user.email, user.photoURL));
        } else {
          reject(new Error("User not found"))
        }
      });
    });
  }

  signOut(): Promise<void> {
    return this._auth.signOut();
  }
}
