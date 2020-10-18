import { UserReducer, userReducer } from './user/reducer';
import { CanvasReducer, canvasReducer } from './canvas/reducer';
import { CombinedState, combineReducers } from 'redux';
import { ActionsObservable, combineEpics, Epic, StateObservable } from 'redux-observable';
import { catchError } from 'rxjs/operators';
import { loginWithGoogleAccount, listenUserChanges, listenProfileChanges } from '../use-cases/authentication';
import { drawInCanvas, readCanvas } from '../use-cases/drawing';

export interface RootReducer {
  userReducer: UserReducer;
  canvasReducer: CanvasReducer;
}

export const rootReducer: CombinedState<any> = combineReducers({
  userReducer,
  canvasReducer,
});

export const rootEpic: Epic = (action$: ActionsObservable<any>, store$: StateObservable<any>, dependencies: any) =>
  combineEpics(
    loginWithGoogleAccount,
    listenUserChanges,
    listenProfileChanges,
    drawInCanvas,
    readCanvas,
  )(action$, store$, dependencies).pipe(
    catchError((error, source) => {
      console.log("FATAL ERROR", error);
      return source;
    })
  );
