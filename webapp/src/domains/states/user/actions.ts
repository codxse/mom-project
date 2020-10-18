import { UserActions } from './keys';
import { User } from '../../../models/user/User';
import { ActionType, DataPayload, ErrorPayload, LoadingPayload, ResetPayload } from '../_types/ActionType';


// GOOGLE LOGIN ACTIONS
// =============================

export type InitiateLoginWithGoogle = () => ActionType<UserActions.LOGIN_WITH_GOOGLE_REQ, LoadingPayload>;
export const initiateLoginWithGoogleRequest: InitiateLoginWithGoogle = () => ({
  type: UserActions.LOGIN_WITH_GOOGLE_REQ,
  payload: { loading: true, data: null },
});

export type MapLoginWithGoogleSuccess = (user: User) => ActionType<UserActions.LOGIN_WITH_GOOGLE_OK, DataPayload<User>>;
export const mapLoginWithGoogleSuccess: MapLoginWithGoogleSuccess = (user: User) => ({
  type: UserActions.LOGIN_WITH_GOOGLE_OK,
  payload: { loading: false, data: user },
});

export type MapLoginWithGoogleFailure<Err = any> = (error: Err) => ActionType<UserActions.LOGIN_WITH_GOOGLE_ERR, ErrorPayload<Err>>;
export const mapLoginWithGoogleFailure: MapLoginWithGoogleFailure = (error: any) => ({
  type: UserActions.LOGIN_WITH_GOOGLE_ERR,
  payload: { loading: false, error: error },
});

export type ClearStateGoogleLogin = () => ActionType<UserActions.CLEAR_STATE_LOGIN_WITH_GOOGLE, ResetPayload>;
export const clearStateGoogleLogin: ClearStateGoogleLogin = () => ({
  type: UserActions.CLEAR_STATE_LOGIN_WITH_GOOGLE,
  payload: { loading: false, data: null, error: null },
});

// LISTEN ON USER SESSION CHANGES
// =======================================

export type ListenOnUserChanges = () => ActionType<UserActions.LISTEN_ON_USER_CHANGES>;
export const listenOnUserChanges: ListenOnUserChanges = () => ({
  type: UserActions.LISTEN_ON_USER_CHANGES,
  payload: { loading: true },
});

// LISTEN USER PROFILE
// ==================================

export type InitiateGetUserProfile = (userId: string) => ActionType<UserActions.GET_USER_PROFILE_REQ, LoadingPayload>;
export const initiateGetUserProfile: InitiateGetUserProfile = (userId: string) => ({
  type: UserActions.GET_USER_PROFILE_REQ,
  payload: { loading: true, data: userId },
});

export type MapGetUserProfileSuccess = (profile: any) => ActionType<UserActions.GET_USER_PROFILE_OK, DataPayload<any>>;
export const mapGetUserProfileSuccess: MapGetUserProfileSuccess = (profile: any) => ({
  type: UserActions.GET_USER_PROFILE_OK,
  payload: { loading: false, data: profile },
});

export type MapGetUserProfileFailure<Err = any> = (error: Err) => ActionType<UserActions.GET_USER_PROFILE_ERR, ErrorPayload<Err>>;
export const mapGetUserProfileFailure: MapGetUserProfileFailure = (error: any) => ({
  type: UserActions.GET_USER_PROFILE_ERR,
  payload: { loading: false, error: error },
});

export type ClearStateGetUserProfile = () => ActionType<UserActions.CLEAR_STATE_GET_USER_PROFILE, ResetPayload>;
export const clearStateGetUserProfile: ClearStateGetUserProfile = () => ({
  type: UserActions.CLEAR_STATE_GET_USER_PROFILE,
  payload: { loading: false, data: null, error: null },
});
