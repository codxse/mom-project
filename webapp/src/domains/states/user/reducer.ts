import { User } from '../../../models/user';
import { UserActions } from './keys';
import { ActionType, PayloadState } from '../_types/ActionType';

export interface UserReducer {
  currentUser: PayloadState;
}

const DEFAULT_STATE: UserReducer = {
  currentUser: { data: null, error: null, loading: false },
};

export const userReducer = (state: UserReducer = DEFAULT_STATE, action: ActionType<UserActions, PayloadState>): UserReducer => {
  switch (action.type) {
    case UserActions.LOGIN_WITH_GOOGLE_REQ:
    case UserActions.LOGIN_WITH_GOOGLE_OK:
    case UserActions.LOGIN_WITH_GOOGLE_ERR:
    case UserActions.CLEAR_STATE_LOGIN_WITH_GOOGLE:
    case UserActions.LISTEN_ON_USER_CHANGES:
      return {
        ...state,
        currentUser: action.payload,
      };
    default: return state;
  }
};
