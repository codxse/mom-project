import { ActionsObservable, ofType, StateObservable } from 'redux-observable';
import { CanvasActions } from '../states/canvas/keys';
import { catchError, map, mapTo, mergeMap, repeat, retryWhen, skipUntil, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { errorDrawInCanvas, mapDawInCanvas } from '../states/canvas/actions';
import { fromEvent, fromEventPattern } from 'rxjs';
import { ActionType } from '../states/_types/ActionType';
import { RootReducer } from '../states/root-reducer';
import { System } from '../services/System';
import { QuerySnapshot } from '../services/database';


const createPath = (canvas: HTMLCanvasElement, x: number, y: number, thick: number, color: string): void => {
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.beginPath();
    ctx?.arc(x, y, thick, 0, 2 * Math.PI);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx?.fill();
  }
};

const drawing = (event: MouseEvent, canvas: HTMLCanvasElement, color: string, size: number, logged?: boolean): Promise<any> | null => {
  const ctx = canvas.getContext("2d");
  const {left, top} = canvas.getBoundingClientRect();
  const {clientX, clientY} = event;
  const X = clientX - left;
  const Y = clientY - top;
  if (ctx) {
    createPath(canvas, X, Y, size, color);
    if (logged) {
      return System.instance.database.setDoc("canvas", {
        x: X,
        y: Y,
        color: color,
        thick: size,
      });
    }
    return null;
  }
  return null;
};

export const drawInCanvas = (
  action$: ActionsObservable<ActionType<CanvasActions.INITIATE_MOUSE_EVENT>>,
  store$:  StateObservable<RootReducer>,
  dependency: any
) => {
  return action$
    .ofType(CanvasActions.INITIATE_MOUSE_EVENT)
    .pipe(
      switchMap((action: ActionType<CanvasActions.INITIATE_MOUSE_EVENT, HTMLCanvasElement>) => {
        const canvas = action.payload;
        const $mouseMove = fromEvent<MouseEvent>(canvas, 'mousemove');
        const $mouseDown = fromEvent<MouseEvent>(canvas, 'mousedown');
        const $mouseUp = fromEvent<MouseEvent>(canvas, 'mouseup');
        return $mouseMove.pipe(
          skipUntil($mouseDown),
          takeUntil($mouseUp),
          repeat(),
        ).pipe(
          withLatestFrom(store$),
          switchMap(async ([mouseEvent, state]) => {
            const user = Boolean(state.userReducer.currentUser.data?._id);
            return drawing(mouseEvent, canvas, state.canvasReducer.setting.penColor, state.canvasReducer.setting.penSize, user);
          }),
          retryWhen(error$ => {
            return error$.pipe(
              withLatestFrom(store$),
              tap( ([mouseEvent, state]) => {
                const user = Boolean(state.userReducer.currentUser.data?._id);
                drawing(mouseEvent, canvas, state.canvasReducer.setting.penColor, state.canvasReducer.setting.penSize, user);
              }),
            );
          }),
          mapTo(mapDawInCanvas())
        );
      }),
    );
};

export const readCanvas = (
  action$: ActionsObservable<ActionType<CanvasActions.READ_CANVAS_DRAWINGS, HTMLCanvasElement>>,
  store$: StateObservable<RootReducer>,
  dependency: any,
) => {
  return action$.pipe(
    ofType(CanvasActions.READ_CANVAS_DRAWINGS),
    withLatestFrom(store$),
    mergeMap(([action, state]) => {
      const canvas: HTMLCanvasElement = action.payload;
      return fromEventPattern<QuerySnapshot>(
        handler => {
          return System.instance.database
            .getCollection("/canvas")
            .onSnapshot(handler);
        },
        (handler, unsubscribe) => unsubscribe(),
      ).pipe(
        map(querySnapshot => {
          if (querySnapshot.empty) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
          }
          querySnapshot.forEach(doc => {
            const data: any = doc.data();
            createPath(canvas, data.x, data.y, data.thick, data.color);
          });
          return mapDawInCanvas();
        }),
        takeUntil(action$.pipe(
          ofType(CanvasActions.STOP_LISTEN_TO_FIREBASE_DRAWING),
        )),
        catchError((error, trace) => [errorDrawInCanvas(error)]),
      );
    }),
  );
};
