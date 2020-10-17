import { ActionsObservable, ofType } from 'redux-observable';
import { UserActions } from '../states/user/keys';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { mapLoginWithGoogleFailure, mapLoginWithGoogleSuccess } from '../states/user/actions';
import { System } from '../services/System';

export const loginWithGoogleAccount = (action$: ActionsObservable<any>) => {
  return action$.pipe(
    ofType(UserActions.LOGIN_WITH_GOOGLE_REQ),
    debounceTime(500),
    switchMap(project => System.instance.authService.loginWithGoogle()),
    map(result => mapLoginWithGoogleSuccess(result)),
    catchError((err, trace) => [mapLoginWithGoogleFailure(err)])
  );
};

export const listenUserChanges = (action$: ActionsObservable<any>) => {
  return action$.pipe(
    ofType(UserActions.LISTEN_ON_USER_CHANGES),
    switchMap(project => System.instance.authService.onUserAuth()),
    map(result => mapLoginWithGoogleSuccess(result)),
    catchError((err, trace) => [mapLoginWithGoogleFailure(err)])
  );
};
