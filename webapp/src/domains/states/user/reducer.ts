import { UserActions } from './keys';
import { ActionType, PayloadState } from '../_types/ActionType';
import { User } from '../../../models/user';

export interface UserReducer {
  currentUser: PayloadState<User | null>;
}

const DEFAULT_STATE: UserReducer = {
  currentUser: { data: null, error: null, loading: false },
};

export const userReducer = (state: UserReducer = DEFAULT_STATE, action: ActionType<UserActions, PayloadState>): UserReducer => {
  switch (action.type) {
    case UserActions.GET_USER_PROFILE_REQ:
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          loading: action.payload.loading,
          error: action.payload.error,
        }
      };
    case UserActions.LOGIN_WITH_GOOGLE_REQ:
    case UserActions.LOGIN_WITH_GOOGLE_OK:
    case UserActions.LOGIN_WITH_GOOGLE_ERR:
    case UserActions.LISTEN_ON_USER_CHANGES:
    case UserActions.GET_USER_PROFILE_OK:
    case UserActions.GET_USER_PROFILE_ERR:
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          ...action.payload,
          data: action.payload.data,
        }
      };
    case UserActions.CLEAR_STATE_LOGIN_WITH_GOOGLE:
    case UserActions.CLEAR_STATE_GET_USER_PROFILE:
      return {
        ...state,
        currentUser: action.payload,
      };
    default: return state;
  }
};
