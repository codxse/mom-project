import { ActionsObservable, ofType, StateObservable } from 'redux-observable';
import { CanvasActions } from '../states/canvas/keys';
import { catchError, map, mapTo, mergeMap, repeat, retryWhen, skipUntil, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { clearStateDrawing, errorDrawInCanvas, mapDawInCanvas } from '../states/canvas/actions';
import { fromEvent, fromEventPattern } from 'rxjs';
import { ActionType } from '../states/_types/ActionType';
import { RootReducer } from '../states/root-reducer';
import { System } from '../services/System';
import { QuerySnapshot } from '../services/database';
import { DrawingCoordinate } from '../../models/drawing-coordinate';
import { UserActions } from '../states/user/keys';


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

const drawing = (event: MouseEvent, canvas: HTMLCanvasElement): Promise<any> | null => {
  const ctx = canvas.getContext("2d");
  const {left, top} = canvas.getBoundingClientRect();
  const {clientX, clientY} = event;
  const X = clientX - left;
  const Y = clientY - top;
  const COLOR = "#FF0000";
  const THICK = 10;
  if (ctx) {
    createPath(canvas, X, Y, THICK, COLOR);
    return System.instance.database.setDoc("canvas", {
      x: X,
      y: Y,
      color: COLOR,
      thick: THICK,
    });
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
          tap(mouseEvent => {
            console.log(mouseEvent);
          }),
          switchMap(async mouseEvent => {
            return drawing(mouseEvent, canvas);
          }),
          retryWhen(error$ => {
            return error$.pipe(
              tap( mouseEvent => drawing(mouseEvent, canvas)),
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
            // const coordinate = new DrawingCoordinate({
            //   _id: doc.id,
            //   x: data.x,
            //   y: data.y,
            //   color: data.color,
            //   thick: data.thick,
            // });
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
