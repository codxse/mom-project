import { UserReducer, userReducer } from './user/reducer';
import { CombinedState, combineReducers } from 'redux';
import { ActionsObservable, combineEpics, Epic, StateObservable } from 'redux-observable';
import { catchError } from 'rxjs/operators';
import { loginWithGoogleAccount, listenUserChanges } from '../use-cases/authentication';

export interface RootReducer {
  userReducer: UserReducer;
}

export const rootReducer: CombinedState<any> = combineReducers({
  userReducer,
});

export const rootEpic: Epic = (action$: ActionsObservable<any>, store$: StateObservable<any>, dependencies: any) =>
  combineEpics(
    loginWithGoogleAccount,
    listenUserChanges,
  )(action$, store$, dependencies).pipe(
    catchError((error, source) => {
      console.log("FATAL ERROR", error);
      return source;
    })
  );
