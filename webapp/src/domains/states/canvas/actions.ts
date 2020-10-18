import { CanvasActions } from './keys';
import { Action } from 'redux';
import { ActionType } from '../_types/ActionType';


export type InitiateMouse  = (canvas: HTMLCanvasElement) => ActionType<CanvasActions.INITIATE_MOUSE_EVENT, HTMLCanvasElement>;
export const initiateMouse: InitiateMouse = (canvas: HTMLCanvasElement) => ({
  type: CanvasActions.INITIATE_MOUSE_EVENT,
  payload: canvas,
});

export type MapDrawInCanvas = () => Action<CanvasActions.DRAW_IN_CANVAS>;
export const mapDawInCanvas: MapDrawInCanvas = () => ({
  type: CanvasActions.DRAW_IN_CANVAS,
});

export type ReadCanvasDrawing = (canvas: HTMLCanvasElement) => ActionType<CanvasActions.READ_CANVAS_DRAWINGS, HTMLCanvasElement>;
export const readCanvasDrawing: ReadCanvasDrawing = (canvas: HTMLCanvasElement) => ({
  type: CanvasActions.READ_CANVAS_DRAWINGS,
  payload: canvas,
});

export type ClearStateDrawing = () => Action<CanvasActions.STOP_LISTEN_TO_FIREBASE_DRAWING>;
export const clearStateDrawing: ClearStateDrawing = () => ({
  type: CanvasActions.STOP_LISTEN_TO_FIREBASE_DRAWING,
});

export const errorDrawInCanvas = (error: any) => ({
  type: CanvasActions.ERROR_READ_CANVAS_DRAWING,
  payload: error,
});
