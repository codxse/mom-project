export interface IFirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export const firebaseConfig: IFirebaseConfig = {
  apiKey: "AIzaSyCRAX8LunfO4aQgRXyWiqwzaZPGQbe7pmQ",
  authDomain: "remote-config-demo-3eb4c.firebaseapp.com",
  databaseURL: "https://remote-config-demo-3eb4c.firebaseio.com",
  projectId: "remote-config-demo-3eb4c",
  storageBucket: "remote-config-demo-3eb4c.appspot.com",
  messagingSenderId: "232509884210",
  appId: "1:232509884210:web:4f979494ee0c9c2f9d792b"
};

export interface IAppConfig {
  appName: string,
}

export const appConfig: IAppConfig = {
  appName: "mom-web-app",
};
