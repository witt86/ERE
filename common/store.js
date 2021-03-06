import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import axios from 'axios'
import createReducer from './createReducer'
import { callAPIMiddleware } from './middleware/callAPIMiddleware'
import createLogger from 'redux-logger';

const logger = createLogger();

export function configureStore (initialState) {

  let MiddlewareTobeApply=[thunk,callAPIMiddleware];
  if(typeof window == 'object' && (process.env.NODE_ENV === 'development')){
    MiddlewareTobeApply.push(logger);
  };

  let store = createStore(createReducer(), initialState, compose(
    applyMiddleware(
        ...MiddlewareTobeApply
    ),
    process.env.NODE_ENV === 'development' &&
    typeof window === 'object' &&
    typeof window.devToolsExtension !== 'undefined'
      ? window.devToolsExtension()
      : f => f
  ))

  store.asyncReducers = {}

  if (process.env.NODE_ENV === 'development') {
    if (module.hot) {
      module.hot.accept('./createReducer', () => store.replaceReducer(require('./createReducer').default))
    }
  }

  return store
}

export function injectAsyncReducer (store, name, asyncReducer) {
  store.asyncReducers[name] = asyncReducer
  store.replaceReducer(createReducer(store.asyncReducers))
}
