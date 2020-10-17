import { createStore, applyMiddleware, compose, Store } from "redux";
import logger from "redux-logger";
import { rootReducer, rootEpic } from './root-reducer';
import { createEpicMiddleware, EpicMiddleware } from 'redux-observable';

const epicMiddleware: EpicMiddleware<any> = createEpicMiddleware();

export const configureStore = () => {
  const store: Store = createStore(rootReducer, compose(applyMiddleware(logger, epicMiddleware)));
  epicMiddleware.run(rootEpic);
  return store;
};
