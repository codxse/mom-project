import { Action } from 'redux';

export interface ActionType<DispatchString = any, Payload = any> extends Action {
  type: DispatchString;
  payload: Payload;
}

export interface LoadingPayload<Data = any> {
  loading: boolean;
  data: Data;
}

export interface DataPayload<Data = any> {
  loading: false;
  data: Data;
}

export interface ErrorPayload<Err = any> {
  loading: false;
  error: Err;
}

export interface ResetPayload {
  data: null;
  error: null;
  loading: false;
}

export interface PayloadState<D = any, E = any, L = boolean> {
  data: D;
  error: E,
  loading: L,
}
