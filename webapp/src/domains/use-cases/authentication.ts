import { ActionsObservable, ofType, StateObservable } from 'redux-observable';
import { UserActions } from '../states/user/keys';
import {
  catchError,
  debounceTime,
  map, mapTo,
  mergeMap,
  switchMap,
  takeUntil, tap,
  withLatestFrom
} from 'rxjs/operators';
import {
  clearStateGoogleLogin,
  mapGetUserProfileFailure,
  mapGetUserProfileSuccess,
  mapLoginWithGoogleFailure,
  mapLoginWithGoogleSuccess
} from '../states/user/actions';
import { System } from '../services/System';
import { fromEventPattern } from 'rxjs';
import { ActionType } from '../states/_types/ActionType';
import { RootReducer } from '../states/root-reducer';
import { DocumentSnapshot } from '../services/database';
import * as firebase from 'firebase/app';
import { User } from '../../models/user';

export const loginWithGoogleAccount = (action$: ActionsObservable<any>, store$: StateObservable<any>, dependency: any) => {
  return action$.pipe(
    ofType(UserActions.LOGIN_WITH_GOOGLE_REQ),
    debounceTime(500),
    switchMap(action => System.instance.authService.loginWithGoogle()),
    map(result => mapLoginWithGoogleSuccess(result)),
    catchError((err, trace) => [mapLoginWithGoogleFailure(err)])
  );
};

export const listenUserChanges = (action$: ActionsObservable<ActionType>, store$: StateObservable<RootReducer>, dependency: any) => {
  return action$.pipe(
    ofType(UserActions.LISTEN_ON_USER_CHANGES),
    debounceTime(500),
    withLatestFrom(store$),
    mergeMap(([action, state]) => {
      return fromEventPattern<firebase.User | null>(
        handler => {
          return System.instance.authService.auth.onAuthStateChanged(handler);
        },
        (handler, unsubscribe) => unsubscribe(),
      ).pipe(
        map(userOrNull => {
          if (userOrNull) {
            const currentUser = state.userReducer.currentUser.data;
            if (currentUser) {
              currentUser.displayName = userOrNull.displayName ?? "Zenness";
              currentUser.email = userOrNull.email ?? undefined;
              currentUser.firstName = currentUser.firstName ? currentUser.firstName : "-";
              currentUser.avatar = userOrNull.photoURL ?? undefined;
              return mapLoginWithGoogleSuccess(currentUser);
            } else {
              const newUser = new User({
                _id: userOrNull.uid,
                displayName: userOrNull.displayName || "Zenness",
                email: userOrNull.email ?? undefined,
                firstName: "-",
                avatar: userOrNull.photoURL ?? undefined,
              });
              return mapLoginWithGoogleSuccess(newUser);
            }
          } else {
            return clearStateGoogleLogin();
          }
        }),
        takeUntil(action$.pipe(
          ofType(UserActions.CLEAR_STATE_LOGIN_WITH_GOOGLE),
        )),
        catchError((err, trace) => [mapLoginWithGoogleFailure(err)]),
      )
    }),
  );
};

export const listenProfileChanges = (action$: ActionsObservable<ActionType>, store$: StateObservable<RootReducer>, dependency: any) => {
  return action$.pipe(
    ofType(UserActions.GET_USER_PROFILE_REQ),
    withLatestFrom(store$),
    mergeMap(([action, state]) => {
      return fromEventPattern<DocumentSnapshot>(
        handler => {
          const ref = System.instance.database.queryDoc(`/users/${action.payload.data}`);
          return ref.onSnapshot(handler);
        },
        (handler, unsubscribe) => unsubscribe(),
      ).pipe(
        map((project: DocumentSnapshot) => {
          const next: any = project.data();
          const currentUser = state.userReducer.currentUser.data;
          if (currentUser) {
            currentUser.firstName = next.firstName;
            currentUser.lastName = next.lastName;
          }
          return mapGetUserProfileSuccess(currentUser);
        }),
        takeUntil(action$.pipe(
          ofType(UserActions.CLEAR_STATE_GET_USER_PROFILE),
        )),
        catchError((err, trace) => [mapGetUserProfileFailure(err)]),
      );
    }),
  );
};
