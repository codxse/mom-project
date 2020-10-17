import { UserActions } from './keys';
import { User } from '../../../models/user';
import { ActionType, DataPayload, ErrorPayload, LoadingPayload, ResetPayload } from '../_types/ActionType';

export type InitiateLoginWithGoogle = () => ActionType<UserActions.LOGIN_WITH_GOOGLE_REQ, LoadingPayload>;
export const initiateLoginWithGoogleRequest: InitiateLoginWithGoogle = () => ({
  type: UserActions.LOGIN_WITH_GOOGLE_REQ,
  payload: { loading: true },
});

export type MapLoginWithGoogleSuccess = (user: User) => ActionType<UserActions.LOGIN_WITH_GOOGLE_OK, DataPayload<User>>;
export const mapLoginWithGoogleSuccess: MapLoginWithGoogleSuccess = (user: User) => ({
  type: UserActions.LOGIN_WITH_GOOGLE_OK,
  payload: { data: user },
});

export type MapLoginWithGoogleFailure<Err = any> = (error: Err) => ActionType<UserActions.LOGIN_WITH_GOOGLE_ERR, ErrorPayload<Err>>;
export const mapLoginWithGoogleFailure: MapLoginWithGoogleFailure = (error: any) => ({
  type: UserActions.LOGIN_WITH_GOOGLE_ERR,
  payload: { error: error },
});

export type ClearStateGoogleLogin = () => ActionType<UserActions.CLEAR_STATE_LOGIN_WITH_GOOGLE, ResetPayload>;
export const clearStateGoogleLogin: ClearStateGoogleLogin = () => ({
  type: UserActions.CLEAR_STATE_LOGIN_WITH_GOOGLE,
  payload: { loading: false, data: null, error: null },
});

export type ListenOnUserChanges = () => ActionType<UserActions.LISTEN_ON_USER_CHANGES>;
export const listenOnUserChanges: ListenOnUserChanges = () => ({
  type: UserActions.LISTEN_ON_USER_CHANGES,
  payload: { loading: true },
});
