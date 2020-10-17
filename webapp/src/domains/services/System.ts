import { Authentication } from './authentication';
import { firebaseConfig } from '../../config';
import { Database } from './database';

export class System {
  private static _instance: System | null = null;
  authService: Authentication = new Authentication(firebaseConfig);
  database: Database = new Database(firebaseConfig);

  static get instance(): System {
    if (this._instance === null) {
      this._instance = new System();
      return this._instance;
    }
    return this._instance;
  };

}
