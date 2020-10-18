import { Action } from 'redux';
import { CanvasActions } from './keys';
import { ActionType } from '../_types/ActionType';

export interface CanvasReducer {
  drawingStatus: {
    data: any,
    error: any,
    loading: boolean,
  }
}

const DEFAULT_STATE: CanvasReducer = {
  drawingStatus: {
    data: null,
    error: null,
    loading: false,
  }
};

export const canvasReducer = (state: CanvasReducer = DEFAULT_STATE, action: Action | ActionType): CanvasReducer => {
  switch (action.type) {
    case CanvasActions.ERROR_READ_CANVAS_DRAWING:
      return {
        ...state,
        drawingStatus: {
          data: state.drawingStatus.data,
          error: (action as ActionType).payload,
          loading: false,
        }
      };
    case CanvasActions.INITIATE_MOUSE_EVENT:
    case CanvasActions.DRAW_IN_CANVAS:
    case CanvasActions.READ_CANVAS_DRAWINGS:
    case CanvasActions.STOP_LISTEN_TO_FIREBASE_DRAWING:
      return {
        ...state,
      };
    default: return state;
  }
};
