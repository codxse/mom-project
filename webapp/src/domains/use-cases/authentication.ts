import { ActionsObservable, ofType, StateObservable } from 'redux-observable';
import { UserActions } from '../states/user/keys';
import { catchError, debounceTime, filter, map, mapTo, merge, mergeMap, switchMap, tap } from 'rxjs/operators';
import {
  clearStateGetUserProfile,
  mapGetUserProfileFailure,
  mapGetUserProfileSuccess,
  mapLoginWithGoogleFailure,
  mapLoginWithGoogleSuccess
} from '../states/user/actions';
import { System } from '../services/System';
import { Observable, pipe } from 'rxjs';
import { ActionType } from '../states/_types/ActionType';
import { UserReducer } from '../states/user/reducer';
import { RootReducer } from '../states/root-reducer';

export const loginWithGoogleAccount = (action$: ActionsObservable<any>, store$: StateObservable<any>, dependency: any) => {
  return action$.pipe(
    ofType(UserActions.LOGIN_WITH_GOOGLE_REQ),
    debounceTime(500),
    switchMap(action => System.instance.authService.loginWithGoogle()),
    map(result => mapLoginWithGoogleSuccess(result)),
    catchError((err, trace) => [mapLoginWithGoogleFailure(err)])
  );
};

export const listenUserChanges = (action$: ActionsObservable<any>, store$: StateObservable<any>, dependency: any) => {
  return action$.pipe(
    ofType(UserActions.LISTEN_ON_USER_CHANGES),
    switchMap(action => System.instance.authService.onUserAuth()),
    tap((next) => console.log({next})),
    map(result => mapLoginWithGoogleSuccess(result)),
    catchError((err, trace) => [mapLoginWithGoogleFailure(err)])
  );
};

export const listenProfileChanges = (action$: ActionsObservable<ActionType>, store$: StateObservable<RootReducer>, dependency: any) => {
  return action$.pipe(
    ofType(UserActions.GET_USER_PROFILE_REQ),
    tap((action) => console.log({action})),
    switchMap(action => {
      return new Promise((resolve, reject) => {
        const ref = System.instance.database.queryDoc(`/users/${action.payload.data}`);
        ref.onSnapshot(
          doc => resolve(doc.data()),
          err => reject(err),
        );
      });
    }),
    tap((doc: any) => {
      console.log({doc});
      const currentUser = store$.value.userReducer.currentUser.data;
      console.log("--->", currentUser);
    }),
    map(result => {
      const currentUser = store$.value.userReducer.currentUser.data;
      if (currentUser) {
        currentUser.firstName = result.firstName;
        currentUser.lastName = result.lastName;
      }
      return mapGetUserProfileSuccess(currentUser);
    }),
    catchError((err, trace) => [mapLoginWithGoogleFailure(err)]),
  );
};
