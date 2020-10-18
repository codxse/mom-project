import { Action } from 'redux';
import { CanvasActions } from './keys';
import { ActionType } from '../_types/ActionType';

export interface CanvasReducer {
  drawingStatus: {
    data: any,
    error: any,
    loading: boolean,
  };
  setting: {
    penColor: string;
    penSize: number;
  }
}

const DEFAULT_STATE: CanvasReducer = {
  drawingStatus: {
    data: null,
    error: null,
    loading: false,
  },
  setting: {
    penColor: "#FF0000",
    penSize: 10,
  }
};

export const canvasReducer = (state: CanvasReducer = DEFAULT_STATE, action: Action | ActionType): CanvasReducer => {
  switch (action.type) {
    case CanvasActions.CHANGE_PEN_COLOR:
      return {
        ...state,
        setting: {
          ...state.setting,
          penColor: (action as ActionType).payload,
        }
      };
    case CanvasActions.CHANGE_PEN_SIZE:
      return {
        ...state,
        setting: {
          ...state.setting,
          penSize: (action as ActionType).payload,
        }
      };
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
